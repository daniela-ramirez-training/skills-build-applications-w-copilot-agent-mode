import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/** Seed the octofit_db database with test data. */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        username: 'maya-chen',
        email: 'maya.chen@mergington.edu',
        displayName: 'Maya Chen',
        avatarUrl: 'https://i.pravatar.cc/150?img=47',
      },
      {
        username: 'jordan-williams',
        email: 'jordan.williams@mergington.edu',
        displayName: 'Jordan Williams',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
      },
      {
        username: 'sofia-martinez',
        email: 'sofia.martinez@mergington.edu',
        displayName: 'Sofia Martinez',
        avatarUrl: 'https://i.pravatar.cc/150?img=32',
      },
    ]);

    await Team.insertMany([
      {
        name: 'Morning Movers',
        description: 'A friendly team that starts the day with movement.',
        memberIds: [users[0]._id, users[1]._id],
      },
      {
        name: 'Weekend Warriors',
        description: 'Building healthy habits one weekend at a time.',
        memberIds: [users[1]._id, users[2]._id],
      },
    ]);

    await Activity.insertMany([
      { userId: users[0]._id, type: 'Running', durationMinutes: 32, points: 64, completedAt: new Date('2026-08-18T07:30:00Z') },
      { userId: users[1]._id, type: 'Strength training', durationMinutes: 45, points: 90, completedAt: new Date('2026-08-17T16:00:00Z') },
      { userId: users[2]._id, type: 'Walking', durationMinutes: 50, points: 50, completedAt: new Date('2026-08-16T10:15:00Z') },
      { userId: users[0]._id, type: 'Cycling', durationMinutes: 40, points: 80, completedAt: new Date('2026-08-15T09:00:00Z') },
    ]);

    await Leaderboard.insertMany([
      { userId: users[0]._id, points: 144, rank: 1 },
      { userId: users[1]._id, points: 90, rank: 2 },
      { userId: users[2]._id, points: 50, rank: 3 },
    ]);

    await Workout.insertMany([
      {
        name: 'Quick Cardio Burst',
        description: 'A short cardio session for busy school days.',
        difficulty: 'beginner',
        durationMinutes: 15,
        exercises: ['Jumping jacks', 'High knees', 'March in place'],
      },
      {
        name: 'Full Body Circuit',
        description: 'A balanced circuit that builds strength and endurance.',
        difficulty: 'intermediate',
        durationMinutes: 30,
        exercises: ['Squats', 'Push-ups', 'Reverse lunges', 'Plank'],
      },
      {
        name: 'Athlete Conditioning',
        description: 'A challenging conditioning workout for experienced athletes.',
        difficulty: 'advanced',
        durationMinutes: 45,
        exercises: ['Burpees', 'Mountain climbers', 'Split squats', 'Bear crawls'],
      },
    ]);

    console.log('Database seeding complete: 3 users, 2 teams, 4 activities, 3 leaderboard entries, and 3 workouts');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
