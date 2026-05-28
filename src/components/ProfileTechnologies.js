import React, { useState } from "react";
import profileData from "../data/ProfileData";

const ProfileTechnologies = () => {
  // stato per aprire/chiudere categorie
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <section>
      <h3>Experienced Technologies</h3>
      <div className="technologies-container">
        {Object.entries(profileData.technologies).map(([category, items], i) => (
          <div key={i} className="technology-category-card">
            <div 
              className="category-header-card" 
              onClick={() => toggleCategory(category)}
            >
              {category.replace(/([A-Z])/g, ' $1').trim()} ▾
            </div>

            {openCategories[category] && (
              <div className="category-items-cards">
                {items.map((item, j) => (
                  <div key={j} className="tech-item-card">
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileTechnologies;