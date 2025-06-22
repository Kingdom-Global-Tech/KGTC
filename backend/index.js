import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory data
let meals = [
  { id: 1, name: 'Grilled Chicken Salad', calories: 350 },
  { id: 2, name: 'Veggie Stir Fry', calories: 400 },
  { id: 3, name: 'Beef Tacos', calories: 500 }
];

let mealPlans = [];

// Meals API
app.get('/api/meals', (req, res) => {
  res.json(meals);
});

// Meal Plans API
app.get('/api/meal-plans', (req, res) => {
  res.json(mealPlans);
});

app.post('/api/meal-plans', (req, res) => {
  const { name, meals: planMeals } = req.body;
  const newPlan = { id: mealPlans.length + 1, name, meals: planMeals };
  mealPlans.push(newPlan);
  res.status(201).json(newPlan);
});

// Root route for friendly message
app.get('/', (req, res) => {
  res.send('Meal Planning API is running! Available endpoints: /api/meals, /api/meal-plans');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
