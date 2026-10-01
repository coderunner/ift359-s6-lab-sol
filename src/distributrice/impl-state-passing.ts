import {
  ajouterCredit,
  Boisson,
  creditInsere,
  echecInsertion,
  echecSelection,
  enAttente,
  EtatMachine,
  montant,
  resultatAnnulation,
  ResultatAnnulation,
  ResultatInsertion,
  ResultatSelection,
  succesInsertion,
  succesSelection,
} from "./model.js";

export function insererMontant(montantInsere: number): (etat: EtatMachine) => [EtatMachine, ResultatInsertion] {
  return (etat) => {
    switch (etat.statut) {
      case "en_attente": {
        const nouvelEtat = creditInsere(montantInsere);
        return [nouvelEtat, succesInsertion(montant(nouvelEtat))];
      }
      case "credit_insere": {
        const nouvelEtat = ajouterCredit(etat, montantInsere);
        return [nouvelEtat, succesInsertion(montant(nouvelEtat))];
      }
      case "hors_service": {
        return [etat, echecInsertion("Machine hors service")];
      }
    }
  };
}

export function creerSelectionneur(
  catalogue: Record<Boisson, number>,
): (boisson: Boisson) => (etat: EtatMachine) => [EtatMachine, ResultatSelection] {
  return (boisson: Boisson) => {
    return (etat: EtatMachine) => {
      switch (etat.statut) {
        case "en_attente": {
          return [etat, echecSelection("Fonds insuffisants")];
        }
        case "credit_insere": {
          const prix = catalogue[boisson];
          if (prix === undefined) {
            return [etat, echecSelection("Boisson non disponible")];
          }
          if (montant(etat) >= prix) {
            const monnaieRendue = montant(etat) - prix;
            return [enAttente(), succesSelection(boisson, monnaieRendue)];
          }
          return [etat, echecSelection("Fonds insuffisants")];
        }
        case "hors_service": {
          return [etat, echecSelection("Machine hors service")];
        }
      }
    };
  };
}

export function annuler(): (etat: EtatMachine) => [EtatMachine, ResultatAnnulation] {
  return (etat: EtatMachine) => {
    switch (etat.statut) {
      case "en_attente": {
        return [etat, resultatAnnulation(0)];
      }
      case "credit_insere": {
        return [enAttente(), resultatAnnulation(montant(etat))];
      }
      case "hors_service": {
        return [etat, resultatAnnulation(0)];
      }
    }
  };
}
