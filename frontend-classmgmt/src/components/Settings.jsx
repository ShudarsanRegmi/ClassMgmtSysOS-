import React from 'react';
import { useTheme } from '../App';
import { FaCog, FaPalette } from 'react-icons/fa';

const UserSettings = () => {
  const { themeName, setThemeName, themes, theme } = useTheme();

  return (
    <div className={`${theme.bg} min-h-screen py-12`}>
      <div className={`max-w-2xl mx-auto p-8 rounded-2xl ${theme.shadow} ${theme.card} border ${theme.border}`}>
        <div className="flex items-center gap-3 mb-8">
          <FaCog className="text-3xl text-blue-500" />
          <h2 className={`text-3xl font-bold ${theme.text}`}>User Settings</h2>
        </div>
        <div className="space-y-8">
          {/* Theme Section */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <FaPalette className="text-xl text-blue-400" />
              <h3 className={`text-xl font-semibold ${theme.text}`}>Theme</h3>
            </div>
            <p className={`${theme.textMuted} mb-3`}>Choose your preferred appearance for the app.</p>
            <div className="flex gap-4">
              {Object.entries(themes).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setThemeName(key)}
                  className={`px-5 py-2 rounded-lg border-2 transition-all font-semibold focus:outline-none
                    ${themeName === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 shadow'
                      : `${theme.border} ${theme.card} ${theme.text} hover:border-blue-400`}
                  `}
                  aria-pressed={themeName === key}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </section>
          {/* Future settings can be added here */}
          <section>
            <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>More Settings</h3>
            <div className={`${theme.textMuted} italic`}>More user preferences coming soon...</div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
