import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptData, VehicleSpecs } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeReceipt = async (base64Image: string): Promise<ReceiptData> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          {
            text: `Analyse ce reçu de station service au Maroc.
            
            Instructions :
            1. Date (YYYY-MM-DD). Si année floue => courante.
            2. Montant Total (TTC).
            3. Volume (Litres).
            4. Prix Unitaire (si visible).
            5. Odomètre : Cherche "Km", "Kilométrage" ou chiffres manuscrits cohérents.
            6. Lieu : Nom station + Ville.
            7. Plein Complet : Si le volume est élevé (>30L) OU si mention "Plein" / "Full", set true. Sinon false.
            8. Ville : Ville de la station (ex: Casablanca, Rabat).
            9. Fournisseur : Marque de la station (ex: Afriquia, Shell, Total, Winxo, Ziz, Ola).
            
            Devise: MAD.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            time: { type: Type.STRING },
            location: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            volume: { type: Type.NUMBER },
            pricePerUnit: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            odometer: { type: Type.NUMBER },
            isFullTank: { type: Type.BOOLEAN },
            city: { type: Type.STRING },
            supplier: { type: Type.STRING },
          },
          required: ["amount"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ReceiptData;
    }
    throw new Error("Erreur AI");
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const fetchVehicleSpecs = async (model: string, year: number, fuel: string): Promise<VehicleSpecs> => {
  try {
    const prompt = `Génère une fiche technique détaillée (JSON) pour le véhicule suivant : 
    Modèle: ${model}
    Année: ${year}
    Moteur: ${fuel}
    
    Je veux des estimations réalistes si les données exactes sont introuvables.
    Champs requis (en français court) :
    - engine (ex: 1.5L dCi)
    - power (ex: 90 ch)
    - transmission (ex: Manuelle 5)
    - fuelTank (ex: 50 L)
    - tires (taille standard, ex: 185/65 R15)
    - oilType (recommandation, ex: 5W40)
    - battery (ex: 12V 60Ah)
    - dimensions (L x l x h en m)
    - weight (kg)
    - topSpeed (km/h)
    - acceleration (0-100 km/h)
    - consumption (Mixte L/100km)
    - torque (Nm)`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            engine: { type: Type.STRING },
            power: { type: Type.STRING },
            transmission: { type: Type.STRING },
            fuelTank: { type: Type.STRING },
            tires: { type: Type.STRING },
            oilType: { type: Type.STRING },
            battery: { type: Type.STRING },
            dimensions: { type: Type.STRING },
            weight: { type: Type.STRING },
            topSpeed: { type: Type.STRING },
            acceleration: { type: Type.STRING },
            consumption: { type: Type.STRING },
            torque: { type: Type.STRING },
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as VehicleSpecs;
    }
    throw new Error("Erreur génération fiche technique");
  } catch (error) {
    console.error("Gemini Specs Error:", error);
    throw error;
  }
};