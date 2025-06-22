import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [meals, setMeals] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [planName, setPlanName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/meals')
      .then(res => res.json())
      .then(data => setMeals(data));
    fetch('http://localhost:5000/api/meal-plans')
      .then(res => res.json())
      .then(data => setMealPlans(data));
    setLoading(false);
  }, []);

  const handleMealSelect = (meal) => {
    setSelectedMeals(prev =>
      prev.find(m => m.id === meal.id)
        ? prev.filter(m => m.id !== meal.id)
        : [...prev, meal]
    );
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!planName || selectedMeals.length === 0) return;
    const res = await fetch('http://localhost:5000/api/meal-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: planName, meals: selectedMeals })
    });
    const newPlan = await res.json();
    setMealPlans([...mealPlans, newPlan]);
    setPlanName('');
    setSelectedMeals([]);
  };

  return (
    <div className="container">
      <h1>Meal Planning App</h1>
      <section>
        <h2>Browse Meals</h2>
        {loading ? <p>Loading...</p> : (
          <ul className="meals-list">
            {meals.map(meal => (
              <li key={meal.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={!!selectedMeals.find(m => m.id === meal.id)}
                    onChange={() => handleMealSelect(meal)}
                  />
                  {meal.name} ({meal.calories} cal)
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2>Create Meal Plan</h2>
        <form onSubmit={handleCreatePlan} className="meal-plan-form">
          <input
            type="text"
            placeholder="Meal Plan Name"
            value={planName}
            onChange={e => setPlanName(e.target.value)}
            required
          />
          <button type="submit" disabled={!planName || selectedMeals.length === 0}>
            Save Meal Plan
          </button>
        </form>
      </section>
      <section>
        <h2>Saved Meal Plans</h2>
        <ul className="meal-plans-list">
          {mealPlans.map(plan => (
            <li key={plan.id}>
              <strong>{plan.name}</strong>: {plan.meals.map(m => m.name).join(', ')}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
