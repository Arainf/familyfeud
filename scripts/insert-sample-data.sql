-- Insert sample account for testing
INSERT INTO accounts (email, username, password_hash) 
VALUES ('admin@familyfeud.com', 'admin', 'YWRtaW4=') -- password: admin (base64 encoded)
ON CONFLICT (email) DO NOTHING;

-- Insert sample tournament
WITH sample_user AS (
  SELECT id FROM accounts WHERE email = 'admin@familyfeud.com' LIMIT 1
)
INSERT INTO tournaments (user_id, name, mode, status, teams, matches)
SELECT 
  sample_user.id,
  'Championship Tournament',
  'roundrobin',
  'setup',
  '[
    {
      "name": "Red Dragons",
      "primaryColor": "#ef4444",
      "secondaryColor": "#dc2626",
      "icon": "crown",
      "motto": "Fire and Glory!"
    },
    {
      "name": "Blue Lightning",
      "primaryColor": "#3b82f6",
      "secondaryColor": "#2563eb",
      "icon": "star",
      "motto": "Strike Fast, Strike True!"
    }
  ]'::jsonb,
  '[
    {
      "id": "match-0-1",
      "team1Id": "Red Dragons",
      "team2Id": "Blue Lightning",
      "status": "pending",
      "questions": [],
      "currentRound": 1,
      "currentQuestionIndex": 0,
      "gameState": "idle"
    }
  ]'::jsonb
FROM sample_user
ON CONFLICT DO NOTHING;
