import { learnLatestThreats, getStoredThreatIntel } from './knowledgeTools.mjs';
(async () => {
  try {
    const result = await learnLatestThreats({ severity: 'high', limit: 3 });
    console.log('learnLatestThreats result:', JSON.stringify(result));
    const stored = await getStoredThreatIntel({});
    console.log('Stored intel count:', stored.length);
  } catch (e) {
    console.error('Error:', e);
  }
})();

