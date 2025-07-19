-- Create storage buckets for team assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('team-assets', 'team-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for team-assets bucket
CREATE POLICY "Anyone can view team assets" ON storage.objects
FOR SELECT USING (bucket_id = 'team-assets');

CREATE POLICY "Authenticated users can upload team assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'team-assets');

CREATE POLICY "Users can update their own team assets" ON storage.objects
FOR UPDATE USING (bucket_id = 'team-assets');

CREATE POLICY "Users can delete their own team assets" ON storage.objects
FOR DELETE USING (bucket_id = 'team-assets');
