import { Router } from 'express';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

const router = Router();

router.get('/users', async (_request, response) => {
  response.json(await User.find().sort({ createdAt: -1 }));
});

router.post('/users', async (request, response) => {
  try {
    response.status(201).json(await User.create(request.body));
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'Invalid user' });
  }
});

router.get('/teams', async (_request, response) => {
  response.json(await Team.find().populate('memberIds', 'username displayName'));
});

router.post('/teams', async (request, response) => {
  try {
    response.status(201).json(await Team.create(request.body));
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'Invalid team' });
  }
});

router.get('/activities', async (request, response) => {
  const userId = typeof request.query.userId === 'string' ? request.query.userId : undefined;
  const filter: Record<string, string> = {};
  if (userId) filter.userId = userId;
  response.json(await Activity.find(filter).populate('userId', 'username displayName').sort({ completedAt: -1 }));
});

router.post('/activities', async (request, response) => {
  try {
    response.status(201).json(await Activity.create(request.body));
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'Invalid activity' });
  }
});

router.get('/leaderboard', async (_request, response) => {
  response.json(await Leaderboard.find().populate('userId', 'username displayName').sort({ points: -1 }));
});

router.get('/workouts', async (request, response) => {
  const difficulty = typeof request.query.difficulty === 'string' ? request.query.difficulty : undefined;
  const filter: Record<string, string> = {};
  if (difficulty) filter.difficulty = difficulty;
  response.json(await Workout.find(filter).sort({ name: 1 }));
});

router.post('/workouts', async (request, response) => {
  try {
    response.status(201).json(await Workout.create(request.body));
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'Invalid workout' });
  }
});

export default router;
