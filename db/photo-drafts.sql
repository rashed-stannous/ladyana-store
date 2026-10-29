insert into public.products(name,cat,price,stock,sku,image_url,images,sizes,colours,active,color,tag,type,description) values
('Structured handbags','Bags',0,0,'PHOTO-7848','/photos/7848.jpeg',array['/photos/7848.jpeg'],array['One size'],array['Original'],false,'#bd8580','NEW','bag',''),
('Handbag colour collection','Bags',0,0,'PHOTO-7849','/photos/7849.jpeg',array['/photos/7849.jpeg'],array['One size'],array['Original'],false,'#bd8580','NEW','bag',''),
('Pearl-handle embroidered bag','Bags',0,0,'PHOTO-7850','/photos/7850.jpeg',array['/photos/7850.jpeg'],array['One size'],array['Original'],false,'#bd8580','NEW','bag',''),
('Red heart clutch','Bags',0,0,'PHOTO-7851','/photos/7851.jpeg',array['/photos/7851.jpeg'],array['One size'],array['Original'],false,'#bd8580','NEW','bag',''),
('Crystal evening clutches','Bags',0,0,'PHOTO-7854','/photos/7854.jpeg',array['/photos/7854.jpeg'],array['One size'],array['Original'],false,'#bd8580','NEW','bag',''),
('Pearl embellished heels','Footwear',0,0,'PHOTO-7852','/photos/7852.jpeg',array['/photos/7852.jpeg'],array['One size'],array['Original'],false,'#bd8580','NEW','shoe',''),
('Black slingback heels','Footwear',0,0,'PHOTO-7857','/photos/7857.jpeg',array['/photos/7857.jpeg'],array['One size'],array['Original'],false,'#bd8580','NEW','shoe',''),
('Champagne slingback heels','Footwear',0,0,'PHOTO-7858','/photos/7858.jpeg',array['/photos/7858.jpeg'],array['One size'],array['Original'],false,'#bd8580','NEW','shoe',''),
('Leopard-print shoes','Footwear',0,0,'PHOTO-7861','/photos/7861.jpeg',array['/photos/7861.jpeg'],array['One size'],array['Original'],false,'#bd8580','NEW','shoe',''),
('Blue lace outfit','Dresses',0,0,'PHOTO-7855','/photos/7855.jpeg',array['/photos/7855.jpeg'],array['One size'],array['Original'],false,'#bd8580','NEW','dress',''),
('Pink smocked two-piece outfit','Dresses',0,0,'PHOTO-7871','/photos/7871.webp',array['/photos/7871.webp'],array['One size'],array['Original'],false,'#bd8580','NEW','dress',''),
('White floral lace outfit','Dresses',0,0,'PHOTO-7872','/photos/7872.webp',array['/photos/7872.webp'],array['One size'],array['Original'],false,'#bd8580','NEW','dress',''),
('Black lace midi dress','Dresses',0,0,'PHOTO-7873','/photos/7873.webp',array['/photos/7873.webp'],array['One size'],array['Original'],false,'#bd8580','NEW','dress','')
on conflict(sku) do nothing;