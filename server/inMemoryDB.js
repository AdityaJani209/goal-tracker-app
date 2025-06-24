// Simple in-memory database for development when MongoDB is not available
class InMemoryDB {
  constructor() {
    this.users = [];
    this.goals = [];
    this.nextUserId = 1;
    this.nextGoalId = 1;
  }

  // User methods
  async findUserByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  }

  async findUserById(id) {
    return this.users.find(user => user._id === id) || null;
  }

  async createUser(userData) {
    const user = {
      _id: this.nextUserId++,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id, updateData) {
    const userIndex = this.users.findIndex(user => user._id === id);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };
    return this.users[userIndex];
  }

  // Goal methods
  async findGoalsByUserId(userId) {
    return this.goals.filter(goal => goal.user === userId);
  }

  async findGoalById(id) {
    return this.goals.find(goal => goal._id === id) || null;
  }

  async createGoal(goalData) {
    const goal = {
      _id: this.nextGoalId++,
      ...goalData,
      milestones: [],
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.goals.push(goal);
    return goal;
  }

  async updateGoal(id, updateData) {
    const goalIndex = this.goals.findIndex(goal => goal._id === id);
    if (goalIndex === -1) return null;
    
    this.goals[goalIndex] = {
      ...this.goals[goalIndex],
      ...updateData,
      updatedAt: new Date()
    };
    return this.goals[goalIndex];
  }

  async deleteGoal(id) {
    const goalIndex = this.goals.findIndex(goal => goal._id === id);
    if (goalIndex === -1) return null;
    
    const deletedGoal = this.goals[goalIndex];
    this.goals.splice(goalIndex, 1);
    return deletedGoal;
  }
  // Statistics
  async getGoalStats(userId) {
    const userGoals = this.goals.filter(goal => goal.user === userId);
    
    const stats = {
      total: userGoals.length,
      active: userGoals.filter(g => g.status === 'active').length,
      completed: userGoals.filter(g => g.status === 'completed').length,
      paused: userGoals.filter(g => g.status === 'paused').length,
      archived: userGoals.filter(g => g.status === 'archived').length,
      'in-progress': userGoals.filter(g => g.status === 'in-progress').length
    };

    // Calculate overdue goals
    const now = new Date();
    stats.overdue = userGoals.filter(goal => 
      new Date(goal.targetDate) < now && 
      !['completed', 'cancelled'].includes(goal.status)
    ).length;

    // Category breakdown
    const categories = {};
    userGoals.forEach(goal => {
      if (categories[goal.category]) {
        categories[goal.category].count += 1;
      } else {
        categories[goal.category] = { _id: goal.category, count: 1 };
      }
    });

    // Monthly progress (completed goals by month)
    const monthlyProgress = {};
    userGoals.filter(goal => goal.completedAt).forEach(goal => {
      const date = new Date(goal.completedAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (monthlyProgress[key]) {
        monthlyProgress[key].count += 1;
      } else {
        monthlyProgress[key] = {
          _id: { year: date.getFullYear(), month: date.getMonth() + 1 },
          count: 1
        };
      }
    });

    return {
      total: stats.total,
      completed: stats.completed,
      inProgress: stats['in-progress'],
      overdue: stats.overdue,
      active: stats.active,
      paused: stats.paused,
      archived: stats.archived,
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      categories: Object.values(categories),
      monthlyProgress: Object.values(monthlyProgress)
    };
  }
}

module.exports = new InMemoryDB();
