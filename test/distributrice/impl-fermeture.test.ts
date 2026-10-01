import { describe, it, expect, beforeEach } from "vitest";
import { creerDistributrice, type Distributrice } from "../../src/distributrice/impl-fermeture.js";
import { type Boisson } from "../../src/distributrice/model.js";

describe("Distributrice — Version Mutable (Fermeture)", () => {
  const catalogue: Record<Boisson, number> = {
    espresso: 100,
    the: 80,
    chocolat: 150,
  };

  let machine: Distributrice;

  beforeEach(() => {
    machine = creerDistributrice(catalogue);
  });

  describe("Insertion de crédits", () => {
    it("démarre en attente et passe en crédit inséré dès le premier versement", () => {
      const res = machine.insererMontant(50);
      expect(res).toEqual({ succes: true, soldeCourant: 50 });
    });

    it("accumule les montants lors de versements consécutifs", () => {
      machine.insererMontant(50);
      const res = machine.insererMontant(100);
      expect(res).toEqual({ succes: true, soldeCourant: 150 });
    });
  });

  describe("Sélection de boissons", () => {
    it("refuse la sélection si aucun montant n'a été inséré (en attente)", () => {
      const res = machine.selectionnerBoisson("espresso");
      expect(res).toEqual({ succes: false, raison: "Fonds insuffisants" });
    });

    it("refuse la sélection si le crédit inséré est insuffisant pour la boisson", () => {
      machine.insererMontant(50);
      const res = machine.selectionnerBoisson("espresso"); // Coût 100
      expect(res).toEqual({ succes: false, raison: "Fonds insuffisants" });
    });

    it("sert la boisson sans monnaie rendue si le montant est exact et réinitialise la machine", () => {
      machine.insererMontant(100);
      const res = machine.selectionnerBoisson("espresso");

      expect(res).toEqual({
        succes: true,
        boisson: "espresso",
        monnaieRendue: 0,
      });

      // Vérification que la machine est réinitialisée en attente : un achat suivant doit échouer
      const resApres = machine.selectionnerBoisson("the");
      expect(resApres).toEqual({ succes: false, raison: "Fonds insuffisants" });
    });

    it("sert la boisson, rend la monnaie excédentaire et remet la machine en attente", () => {
      machine.insererMontant(150);
      const res = machine.selectionnerBoisson("espresso"); // Coût 100

      expect(res).toEqual({
        succes: true,
        boisson: "espresso",
        monnaieRendue: 50,
      });

      // La monnaie a été rendue au client, le crédit résiduel dans la machine est à 0
      const annulationApres = machine.annuler();
      expect(annulationApres).toEqual({ monnaieRendue: 0 });
    });
  });

  describe("Annulation", () => {
    it("retourne 0 si aucune pièce n'a été insérée", () => {
      const res = machine.annuler();
      expect(res).toEqual({ monnaieRendue: 0 });
    });

    it("rend la totalité du montant inséré et réinitialise l'état interne", () => {
      machine.insererMontant(75);
      const res1 = machine.annuler();
      expect(res1).toEqual({ monnaieRendue: 75 });

      // Un second appel immédiat ne doit pas rendre d'argent fantôme
      const res2 = machine.annuler();
      expect(res2).toEqual({ monnaieRendue: 0 });
    });
  });

  describe("Indépendance et étanchéité des instances", () => {
    it("ne partage pas l'état entre deux machines créées séparément", () => {
      const m1 = creerDistributrice(catalogue);
      const m2 = creerDistributrice(catalogue);

      m1.insererMontant(100);
      expect(m1.annuler().monnaieRendue).toBe(100);
      expect(m2.annuler().monnaieRendue).toBe(0);
    });
  });
});
