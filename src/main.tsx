import {createRoot} from 'react-dom/client';
import '@fontsource/caveat/500.css';
import '@fontsource/caveat/700.css';
import '@fontsource/patrick-hand/400.css';
import '@fontsource/kalam/400.css';
import '@fontsource/kalam/700.css';
import App from './App.tsx';
import { HandDefs } from './components/HandDefs';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <>
    <HandDefs />
    <App />
  </>
);
