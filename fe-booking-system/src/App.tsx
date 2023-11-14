import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { routing } from './routing';
import { Loading } from './components/Loading';

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {routing.map((route) => {
            const Component = route.component;
            return (
              <Route
                caseSensitive
                key={route.path}
                path={route.path}
                element={
                  <Suspense fallback={<Loading />}>
                    <Component />
                  </Suspense>
                }
              />
            );
          })}
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
