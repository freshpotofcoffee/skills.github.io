// overview.js

import { user, skills, activities, quests } from './main.js';
import { XP_PER_LEVEL, MAX_SKILL_LEVEL, xpForNextLevel } from './utils.js';
import { loadSection } from './navigation.js';
import { ACHIEVEMENTS } from './rewards.js';
import { isQuestCompleted } from './quests.js';


export function updateDashboard() {
    if (document.getElementById('mainContent').querySelector('.dashboard')) {
        loadOverviewSection();
    }
}

function getActivityStatus(activity) {
    if (activity.repeatable) {
        return activity.completionCount > 0 ? 'recurring' : 'active';
    } else {
        return activity.status;
    }
}

function getActivityStatusLabel(activity) {
    if (activity.repeatable) {
        return activity.completionCount > 0 ? `Recurring (${activity.completionCount}x)` : 'Active';
    } else {
        switch (activity.status) {
            case 'completed':
                return 'Completed';
            case 'in-progress':
            case 'active':
                return 'Active';
            default:
                return 'To-Do';
        }
    }
}

export function loadOverviewSection() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    const nextLevelXP = xpForNextLevel(user.level);
    const currentLevelXP = nextLevelXP - XP_PER_LEVEL;
    const xpProgress = ((user.xp - currentLevelXP) / XP_PER_LEVEL) * 100;
    const masteredSkillsCount = Object.values(skills).filter(s => s.level >= MAX_SKILL_LEVEL).length;
    const totalSkills = Object.keys(skills).length;
    const completedQuests = quests.filter(q => q.completed).length;
    const totalQuests = quests.length;
    const recentActivities = activities
        .sort((a, b) => b.lastUpdated - a.lastUpdated)
        .slice(0, 5);

    const topSkills = Object.entries(skills)
        .sort((a, b) => b[1].level - a[1].level)
        .slice(0, 3);
    
        const activeQuests = quests.filter(q => !isQuestCompleted(q));


    mainContent.innerHTML = `
        <div class="dashboard">
            <div class="hero-section">
                <div class="hero-content">
                    <div class="user-info">
                        <div class="avatar-frame">
                            <img src="${user.avatar || '../images/default-avatar.webp'}" alt="User Avatar" class="user-avatar" id="userAvatar">
                        </div>
                        <div class="user-details">
                            <h2 id="userName">${user.name}</h2>
                            <div class="user-level">
                                <span id="userLevel">Level ${user.level}</span>
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="xp-bar">
                                <div class="xp-fill" id="xpFill" style="width: ${xpProgress}%"></div>
                            </div>
                            <p id="xpInfo">${user.xp - currentLevelXP} / ${XP_PER_LEVEL} XP to next level</p>
                            <div id="streakInfo" class="streak-info">
                                <span class="current-streak"><i class="fas fa-fire"></i> Current: ${user.currentStreak} days</span>
                                <span class="longest-streak"><i class="fas fa-trophy"></i> Longest: ${user.longestStreak} days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats-overview">
                <div class="stat-card">
                    <i class="fas fa-book-open"></i>
                    <h3>Skills Mastered</h3>
                    <p>${masteredSkillsCount} / ${totalSkills}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${totalSkills > 0 ? (masteredSkillsCount / totalSkills) * 100 : 0}%"></div>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>Quests Completed</h3>
                    <p>${completedQuests} / ${totalQuests}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0}%"></div>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-trophy"></i>
                    <h3>Achievements</h3>
                    <p>${user.achievements.length} / ${ACHIEVEMENTS.length}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(user.achievements.length / ACHIEVEMENTS.length) * 100}%"></div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card top-skills">
                    <h3>Top Skills</h3>
                    <div class="card-content">
                        ${topSkills.length > 0 ? topSkills.map(([id, skill]) => `
                            <div class="skill-entry">
                                <div class="skill-icon"><i class="fas ${skill.icon}"></i></div>
                                <div class="skill-details">
                                    <div class="skill-name">${skill.name}</div>
                                    <div class="skill-level">Level ${skill.level}</div>
                                    <div class="skill-bar-wrapper">
                                        <div class="skill-bar" style="width: ${(skill.xp / XP_PER_LEVEL) * 100}%"></div>
                                    </div>
                                    <div class="skill-xp">${skill.xp} / ${XP_PER_LEVEL} XP</div>
                                </div>
                            </div>
                        `).join('') : '<p class="no-skills">No skills added yet. Start by adding a new skill!</p>'}
                    </div>
                    <a href="#" class="see-more" data-section="skills">View all skills</a>
                </div>

<div class="dashboard-card activity-log">
    <h3>Recent Activities</h3>
    <div class="card-content">
        ${recentActivities.length > 0 ? recentActivities.map(activity => `
            <div class="activity-entry">
                <div class="activity-icon"><i class="fas ${skills[activity.skillId]?.icon || 'fa-question'}"></i></div>
                <div class="activity-details">
                    <div class="activity-name">${activity.name}</div>
                    <div class="activity-info">
                        <span class="activity-skill">${skills[activity.skillId]?.name || 'Unknown Skill'}</span>
                        <span class="activity-xp">${activity.xp} XP</span>
                    </div>
                    <div class="activity-status ${getActivityStatus(activity)}">
                        ${getActivityStatusLabel(activity)}
                    </div>
                </div>
            </div>
        `).join('') : '<p class="no-activities">No recent activities. Start by adding a new activity!</p>'}
    </div>
    <a href="#" class="see-more" data-section="activities">View all activities</a>
</div>

<div class="dashboard-card active-quests">
    <h3>Active Quests</h3>
    <div class="card-content">
        ${activeQuests.length > 0 ? activeQuests.map(quest => {
            const completedActivities = quest.activities.filter(actId => {
                const activity = activities.find(a => a.id === actId);
                return activity && (activity.status === 'completed' || (activity.repeatable && activity.completionCount > 0));
            }).length;
            const totalActivities = quest.activities.length;
            const progressPercentage = (completedActivities / totalActivities) * 100;
            
            return `
                <div class="quest-entry">
                    <div class="quest-name">${quest.name}</div>
                    <div class="quest-description">${quest.description}</div>
                    <div class="quest-progress">
                        <span>${completedActivities}/${totalActivities}</span>
                        <div class="quest-progress-bar">
                            <div class="quest-progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                        <span>${progressPercentage.toFixed(0)}%</span>
                    </div>
                </div>
            `;
        }).join('') : '<p class="no-quests">No active quests. Start a new quest to challenge yourself!</p>'}
    </div>
    <a href="#" class="see-more" data-section="quests">View all quests</a>
</div>
    `;

    const seeMoreLinks = mainContent.querySelectorAll('.see-more');
    seeMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadSection(link.dataset.section);
        });
    });
}