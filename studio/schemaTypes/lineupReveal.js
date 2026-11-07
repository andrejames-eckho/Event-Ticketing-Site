// Lineup embargo (docs/11 Edition.lineupRevealAt). Add `lineupRevealAtField` to the Edition document's fields.
// Until this time the site hides the lineup: no links to /lineup, a curtain on the homepage lineup slot and
// no set times. Artist pages stay built so the team can check them. Rules match site/src/lib/lineup.js.
import { defineField } from 'sanity';

export const lineupRevealAtField = defineField({
  name: 'lineupRevealAt',
  title: 'Lineup reveal',
  type: 'datetime',
  description:
    'Date and time (Manila) the lineup goes public. Before this, the lineup is hidden across the site. Leave empty to show the lineup now. The site rebuilds itself at this time, so allow a few minutes.',
  options: { dateFormat: 'D MMM YYYY', timeFormat: 'h:mm A', timeStep: 15 },
});
