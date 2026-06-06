<template>
  <section class="knockout-bracket">
    <div class="section-header">
      <div>
        <p class="section-label">Knockout stage</p>
        <h2>Bracket preview</h2>
      </div>
      <p class="section-help">This view will show the knockout bracket once group predictions are locked in.</p>
    </div>

    <div class="bracket-grid">
      <div class="bracket-column">
        <h3>Round of 32</h3>
        <div class="bracket-card">Winner group A vs Runner-up group B</div>
        <div class="bracket-card">Winner group C vs Runner-up group D</div>
        <div class="bracket-card">Winner group E vs Runner-up group F</div>
        <div class="bracket-card">Winner group G vs Runner-up group H</div>
      </div>

      <div class="bracket-column">
        <h3>Round of 16</h3>
        <div class="bracket-card">Match winners advance</div>
        <div class="bracket-card">Match winners advance</div>
      </div>

      <div class="bracket-column">
        <h3>Quarter-finals</h3>
        <div class="bracket-card">Top 8 teams</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.knockout-bracket {
  padding: 1.5rem;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.08);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.section-label {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #1d4ed8;
}

h2 {
  margin: 0;
  font-size: 1.6rem;
}

.section-help {
  margin: 0;
  color: #4b5563;
}

.bracket-grid {
  display: grid;
  gap: 1rem;
}

.bracket-column {
  display: grid;
  gap: 0.75rem;
}

.bracket-column h3 {
  margin: 0;
  font-size: 1.05rem;
}

.bracket-card {
  padding: 1rem;
  border-radius: 0.9rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  color: #1f2937;
}
</style>
