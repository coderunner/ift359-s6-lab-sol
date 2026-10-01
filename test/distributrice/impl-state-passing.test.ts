import { describe, it, expect } from "vitest";
import { insererMontant, creerSelectionneur, annuler } from "../../src//distributrice/impl-state-passing.js";
import { enAttente, creditInsere, HorsService, Boisson } from "../../src//distributrice/model.js";

describe("Distributrice — Version State-Passing Style (Pur)", () => {
  const catalogue: Record<Boisson, number> = {
    espresso: 100,
    the: 80,
    chocolat: 150,
  };
  const selectionnerBoisson = creerSelectionneur(catalogue);

  describe("insererMontant", () => {
    it("effectue la transition depuis 'en_attente' vers 'credit_insere'", () => {
      const s0 = enAttente();
      const [s1, resultat] = insererMontant(50)(s0);

      expect(s1).toEqual(creditInsere(50));
      expect(resultat).toEqual({ succes: true, soldeCourant: 50 });
      // L'état d'origine reste parfaitement intact
      expect(s0).toEqual({ statut: "en_attente" });
    });

    it("cumule le crédit lorsque la machine est déjà dans l'état 'credit_insere'", () => {
      const s0 = creditInsere(50);
      const [s1, resultat] = insererMontant(100)(s0);

      expect(s1).toEqual(creditInsere(150));
      expect(resultat).toEqual({ succes: true, soldeCourant: 150 });
    });

    it("rejette l'insertion et laisse l'état intact si la machine est hors service", () => {
      const s0: HorsService = {
        statut: "hors_service",
        raison: "Monnayeur bloqué",
      };
      const [s1, resultat] = insererMontant(50)(s0);

      expect(s1).toBe(s0);
      expect(resultat).toEqual({
        succes: false,
        raison: "Machine hors service",
      });
    });
  });

  describe("selectionnerBoisson", () => {
    it("refuse la sélection si la machine est en attente (aucun crédit)", () => {
      const s0 = enAttente();
      const [s1, resultat] = selectionnerBoisson("the")(s0);

      expect(s1).toBe(s0);
      expect(resultat).toEqual({ succes: false, raison: "Fonds insuffisants" });
    });

    it("refuse la sélection si le crédit inséré est insuffisant", () => {
      const s0 = creditInsere(50);
      const [s1, resultat] = selectionnerBoisson("espresso")(s0); // espresso = 100

      expect(s1).toBe(s0);
      expect(resultat).toEqual({ succes: false, raison: "Fonds insuffisants" });
    });

    it("sert la boisson et revient à l'état 'en_attente' avec rendu de monnaie", () => {
      const s0 = creditInsere(150);
      const [s1, resultat] = selectionnerBoisson("espresso")(s0);

      expect(s1).toEqual(enAttente());
      expect(resultat).toEqual({
        succes: true,
        boisson: "espresso",
        monnaieRendue: 50,
      });
    });

    it("gère le montant exact en retournant 0 de monnaie", () => {
      const s0 = creditInsere(100);
      const [s1, resultat] = selectionnerBoisson("espresso")(s0);

      expect(s1).toEqual(enAttente());
      expect(resultat).toEqual({
        succes: true,
        boisson: "espresso",
        monnaieRendue: 0,
      });
    });

    it("rejette la requête sans altérer l'état si la boisson n'est pas au catalogue", () => {
      const s0 = creditInsere(200);
      const [s1, resultat] = selectionnerBoisson("inconnue" as Boisson)(s0);

      expect(s1).toBe(s0);
      expect(resultat).toEqual({
        succes: false,
        raison: "Boisson non disponible",
      });
    });
  });

  describe("annuler", () => {
    it("retourne 0 et reste dans le même état si appelée depuis 'en_attente'", () => {
      const s0 = enAttente();
      const [s1, resultat] = annuler()(s0);

      expect(s1).toBe(s0);
      expect(resultat).toEqual({ monnaieRendue: 0 });
    });

    it("restitue le solde et bascule l'état vers 'en_attente' depuis 'credit_insere'", () => {
      const s0 = creditInsere(120);
      const [s1, resultat] = annuler()(s0);

      expect(s1).toEqual(enAttente());
      expect(resultat).toEqual({ monnaieRendue: 120 });
    });
  });

  describe("Transparence référentielle et persistance historique", () => {
    it("démontre que réexécuter une transition sur un état antérieur donne toujours la même réponse", () => {
      const s0 = enAttente();
      const [s1] = insererMontant(100)(s0);

      // Branche A : on achète un thé (80¢)
      const [sA, resA] = selectionnerBoisson("the")(s1);
      // Branche B : depuis le MÊME état s1, on choisit d'annuler
      const [sB, resB] = annuler()(s1);

      // Les deux branches sont valides et ne se polluent pas mutuellement
      expect(resA).toEqual({ succes: true, boisson: "the", monnaieRendue: 20 });
      expect(sA).toEqual(enAttente());

      expect(resB).toEqual({ monnaieRendue: 100 });
      expect(sB).toEqual(enAttente());

      // s1 est resté intact à 100¢
      expect(s1).toEqual(creditInsere(100));
    });

    it("permet l'enchaînement manuel (State-Passing séquentiel)", () => {
      const s0 = enAttente();
      const [s1] = insererMontant(60)(s0);
      const [s2] = insererMontant(50)(s1);
      const [s3, res] = selectionnerBoisson("espresso")(s2);

      expect(res).toEqual({
        succes: true,
        boisson: "espresso",
        monnaieRendue: 10,
      });
      expect(s3).toEqual(enAttente());
    });
  });
});
