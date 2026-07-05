/**
 * Configuration de base (production).
 * En développement, Angular remplace ce fichier par `environment.development.ts`
 * (fileReplacements). Les composants et services importent TOUJOURS ce fichier-ci.
 */
export const environment = {
  production: true,
  /** Origine du « serveur » de données. Vide = même origine que l'application. */
  serverUrl: '',
  restaurantName: 'Délices de Douala',
};
