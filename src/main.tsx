import React from 'react';
import {createRoot} from 'react-dom/client';
import {LadyanaCompleteShoppingExperience} from './components/generated/LadyanaCompleteShoppingExperience';
import './reset.css';
import {AdminPanel} from './components/AdminPanel';
import {InstallPrompt} from './components/InstallPrompt';
createRoot(document.getElementById('root')!).render(<React.StrictMode>{location.pathname.startsWith('/admin')?<AdminPanel/>:<LadyanaCompleteShoppingExperience/>}<InstallPrompt/></React.StrictMode>);
