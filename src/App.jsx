import chefBanner from './assets/chefs/chef1.jpg';
import chef2 from './assets/chefs/chef2.jpg';
import chef3 from './assets/chefs/chef3.jpg';
import { useEffect, useState } from 'react';
import './App.css';

const mealIcons = {
  'Grilled Chicken Salad': '🥗',
  'Veggie Stir Fry': '🥦',
  'Beef Tacos': '🌮',
};

const mealImages = {
  'Grilled Chicken Salad': chefBanner,
  'Veggie Stir Fry': chef2,
  'Beef Tacos': chef3,
};

function App() {
  const [meals, setMeals] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [planName, setPlanName] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('meals');

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
    <div className="amazon-app-bg">
      <header className="amazon-header">
        <div className="amazon-logo">🍽️ MealPlan</div>
        <nav className="amazon-nav">
          <button className={page==='meals' ? 'active' : ''} onClick={()=>setPage('meals')}>Meals</button>
          <button className={page==='plans' ? 'active' : ''} onClick={()=>setPage('plans')}>Meal Plans</button>
          <button className={page==='about' ? 'active' : ''} onClick={()=>setPage('about')}>About</button>
        </nav>
      </header>
      <main className="amazon-main">
        {page === 'meals' && (
          <>
            <section className="amazon-hero">
              <img src={chefBanner} alt="Chef" className="amazon-hero-img" />
              <div className="amazon-hero-text">
                <h1>Discover Delicious Meals</h1>
                <p>Browse, select, and plan your week with healthy, tasty options.</p>
              </div>
            </section>
            <section>
              <h2 className="amazon-section-title">Meals</h2>
              {loading ? <p>Loading...</p> : (
                <div className="amazon-meals-grid">
                  {meals.map(meal => (
                    <div key={meal.id} className={`amazon-meal-card${selectedMeals.find(m => m.id === meal.id) ? ' selected' : ''}`}>
                      <img src={mealImages[meal.name] || chef2} alt={meal.name} className="amazon-meal-img" />
                      <div className="amazon-meal-info">
                        <span className="amazon-meal-icon">{mealIcons[meal.name] || '🍲'}</span>
                        <div className="amazon-meal-name">{meal.name}</div>
                        <div className="amazon-meal-calories">{meal.calories} cal</div>
                        <input
                          className="amazon-meal-checkbox"
                          type="checkbox"
                          checked={!!selectedMeals.find(m => m.id === meal.id)}
                          onChange={() => handleMealSelect(meal)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <section>
              <h2 className="amazon-section-title">Create Meal Plan</h2>
              <form onSubmit={handleCreatePlan} className="amazon-meal-plan-form">
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
          </>
        )}
        {page === 'plans' && (
          <section>
            <h2 className="amazon-section-title">Saved Meal Plans</h2>
            <div className="amazon-meal-plans-list">
              {mealPlans.map(plan => (
                <div key={plan.id} className="amazon-meal-plan-card">
                  <strong>{plan.name}</strong>: {plan.meals.map(m => `${mealIcons[m.name] || '🍲'} ${m.name}`).join(', ')}
                </div>
              ))}
            </div>
          </section>
        )}
        {page === 'about' && (
          <section className="amazon-about">
            <img src={chef3} alt="Chef" className="amazon-about-img" />
            <h2>About MealPlan</h2>
            <p>MealPlan helps you organize your meals and plans for a healthier, happier life. Built with React and Node.js, inspired by the best in e-commerce design.</p>
          </section>
        )}
      </main>
      <footer className="amazon-footer">
        &copy; {new Date().getFullYear()} MealPlan. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
