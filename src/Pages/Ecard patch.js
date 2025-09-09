<button
            onClick={() => setActiveSection('ecard')}
            className={`px-2 py-1 ${
              activeSection === 'ecard' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Apply For Ecard
          </button>