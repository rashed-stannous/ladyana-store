import React from 'react';
import {createRoot} from 'react-dom/client';
import {LadyanaCompleteShoppingExperience} from './components/generated/LadyanaCompleteShoppingExperience';
import './reset.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><LadyanaCompleteShoppingExperience/></React.StrictMode>);
