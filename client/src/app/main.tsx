import React from 'react';
import ReactDOM from 'react-dom/client';

import { useRoute } from './router/index';
import { routes } from './router/routes';

import '@styles/global.css';
import { Route } from '@router/Route';
import { navigate } from '@router/navigate';

function App() {
    var route = useRoute();
    var entry = routes[route];
    
    if (!entry || !entry.component) {
        navigate('/not-found');
        return null; // prevent rendering with undefined entry
    }

    return <Route {...entry} />;
}

ReactDOM.createRoot(document.body).render(<App />);

