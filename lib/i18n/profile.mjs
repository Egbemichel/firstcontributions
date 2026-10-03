import { createTranslator } from '../i18n.mjs';

const strings = {
  en: {
    'backLink': '← All contributors',
    'contributionsHeading': 'Contributions',
    'addContribution': 'Is this you? Add a contribution',
    'emptyContributions': 'No contributions listed yet. Worked on an issue or a pull request?',
    'emptyContributionsLink': 'Add it to your file',
    'defaultDescription': "{name}'s open source contributions.",
    'kind.pull': 'Pull request',
    'kind.issue': 'Issue',
    'status.merged': 'Merged',
    'status.open': 'Open',
    'status.draft': 'Draft',
    'status.closed': 'Closed',
    'status.completed': 'Closed',
    'status.not-planned': 'Not planned',
    'dateLocale': 'en-GB',
  },
  fr: {
    'backLink': '← Tous les contributeurs',
    'contributionsHeading': 'Contributions',
    'addContribution': "C'est vous ? Ajoutez une contribution",
    'emptyContributions': "Aucune contribution listée pour le moment. Vous avez travaillé sur une issue ou une pull request ?",
    'emptyContributionsLink': 'Ajoutez-la à votre fichier',
    'defaultDescription': 'Les contributions open source de {name}.',
    'kind.pull': 'Pull request',
    'kind.issue': 'Issue',
    'status.merged': 'Fusionnée',
    'status.open': 'Ouverte',
    'status.draft': 'Brouillon',
    'status.closed': 'Fermée',
    'status.completed': 'Fermée',
    'status.not-planned': 'Non planifiée',
    'dateLocale': 'fr-FR',
  },
};

export const tProfile = createTranslator(strings);
