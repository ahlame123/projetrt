import React, { Component } from 'react';
import ofpptlogo from './ofppt.jpeg';

class Vacances extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vacancesAffichees: [],
      vacancesPassees: [],
      timers: {},
    };

    this.afficherToutes = this.afficherToutes.bind(this);
    this.afficherReligieuses = this.afficherReligieuses.bind(this);
    this.afficherNationales = this.afficherNationales.bind(this);
    this.afficherScolaires = this.afficherScolaires.bind(this);
  }

  toutesLesVacances = [
    { occasion: "Aïd al-mawlid annabaoui", date: "2024-10-16", duree: 2, type: "religieuse" },
    { occasion: "Aïd al-fitr", date: "2025-04-10", duree: 3, type: "religieuse" },
    { occasion: "Aïd al-adha", date: "2025-06-28", duree: 4, type: "religieuse" },
    { occasion: "Nouvel an Hijri", date: "2025-07-21", duree: 1, type: "religieuse" },
    { occasion: "Anniversaire de la Marche verte", date: "2024-11-06", duree: 1, type: "nationale" },
    { occasion: "Fête de l'indépendance", date: "2024-11-18", duree: 1, type: "nationale" },
    { occasion: "Nouvel an", date: "2025-01-01", duree: 1, type: "nationale" },
    { occasion: "Anniversaire de la présentation du manifeste de l'indépendance", date: "2025-01-11", duree: 1, type: "nationale" },
    { occasion: "Vacances de mi-trimestre", date: "2024-12-08", duree: 8, type: "scolaire" },
    { occasion: "Vacances d'hiver", date: "2025-01-25", duree: 8, type: "scolaire" },
    { occasion: "Vacances de printemps", date: "2025-04-27", duree: 15, type: "scolaire" },
  ];

  componentDidMount() {
    this.afficherToutes();
    this.interval = setInterval(this.updateTimers, 1000); 
  }

  componentWillUnmount() {
    clearInterval(this.interval); 
  }

  updateTimers = () => {
    const timers = {};
    this.state.vacancesAffichees.forEach(vac => {
      const timer = this.calculateTimeRemaining(vac.date);
      timers[vac.occasion] = timer;
    });
    this.setState({ timers });
  };

  calculateTimeRemaining(date) {
    const now = new Date();
    const vacationDate = new Date(date);

    if (vacationDate < now) {
      return "Déjà passé";
    }

    const diffTime = vacationDate - now;
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

    return `${days} jours, ${hours}h ${minutes}m ${seconds}s`;
  }

  trierVacances(vacances) {
    const now = new Date();
    const vacancesAvenir = vacances.filter(v => new Date(v.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
    const vacancesPassees = vacances.filter(v => new Date(v.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date));

    this.setState({ vacancesAffichees: vacancesAvenir, vacancesPassees });
  }

  afficherToutes() {
    this.trierVacances(this.toutesLesVacances);
  }

  afficherReligieuses() {
    const vacancesReligieuses = this.toutesLesVacances.filter(v => v.type === 'religieuse');
    this.trierVacances(vacancesReligieuses);
  }

  afficherNationales() {
    const vacancesNationales = this.toutesLesVacances.filter(v => v.type === 'nationale');
    this.trierVacances(vacancesNationales);
  }

  afficherScolaires() {
    const vacancesScolaires = this.toutesLesVacances.filter(v => v.type === 'scolaire');
    this.trierVacances(vacancesScolaires);
  }

  render() {
    return (
      <div>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <img src={ofpptlogo} style={styles.logo} alt="Logo OFPPT" />
            <h1>OFPPT</h1>
          </div>
          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={this.afficherToutes}>
              Toutes les Vacances
            </button>
            <button style={styles.button} onClick={this.afficherReligieuses}>
              Vacances Religieuses
            </button>
            <button style={styles.button} onClick={this.afficherNationales}>
              Vacances Nationales
            </button>
            <button style={styles.button} onClick={this.afficherScolaires}>
              Vacances Scolaires
            </button>
          </div>
        </header>

        <section style={styles.body}>
          <h2 style={styles.subtitle}>Vacances à venir</h2>
          <div style={styles.gridContainer}>
            {this.state.vacancesAffichees.map((vac, index) => (
              <div key={index} style={styles.card}>
                <strong style={styles.occasion}>{vac.occasion}</strong>
                <p>Date : {vac.date}</p>
                <p>Durée : {vac.duree} jours</p>
                <p style={{ color: this.state.timers[vac.occasion] === "Déjà passé" ? 'red' : 'green' }}>
                  {this.state.timers[vac.occasion]}
                </p>
              </div>
            ))}
          </div>

          {this.state.vacancesPassees.length > 0 && (
            <div>
              <h2 style={styles.subtitle}>Vacances déjà passées</h2>
              <div style={styles.gridContainer}>
                {this.state.vacancesPassees.map((vac, index) => (
                  <div key={index} style={{ ...styles.card, color: 'red' }}>
                    <strong style={styles.occasion}>{vac.occasion}</strong>
                    <p>Date : {vac.date}</p>
                    <p>Durée : {vac.duree} jours</p>
                    <p>Déjà passé</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }
}

const styles = {
  header: {
    backgroundColor: '#f4f4f4',
    padding: '20px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: '50px',
    marginRight: '20px',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4169E1',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  body: {
    padding: '20px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
    transition: 'transform 0.3s ease',
  },
  cardHovered: {
    transform: 'scale(1.05)',
  },
  occasion: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};

export default Vacances;
