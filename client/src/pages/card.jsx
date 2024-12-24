import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


function Card() {
  const navigate = useNavigate();
  const { id } = useParams();

  // State for card data
  const [card, setCard] = useState({
    cardFirstName: "",
    cardLastName: "",
    cardPicture: "", 
    cardAbout: "This is a brief about me section.", 
    cardSocialLinks: [], 
    cardProjectLinks: [],
    cardBackgroundColor: "#FFFFFF",
  });

  const [isEditing, setIsEditing] = useState(false); 


  // Fetch card data from the backend
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/cards/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // CHECK!!! if necessary
          },
        });
        setCard(response.data);
      } catch (error) {
        console.error("Error fetching card data:", error);
        alert("Error loading card data. Please try again.");
      }
    };

    fetchCardData();
  }, [id]);



  const {
    cardFirstName = "",
    cardLastName = "",
    cardPicture = "",
    cardAbout = "",
    cardSocialLinks = [],
    cardProjectLinks = [],
    cardBackgroundColor = "#FFFFFF",
  } = card;


  // Handle color change
  const handleBackgroundColorChange = (e) => {
    setCard((prevCard) => ({
      ...prevCard,
      cardBackgroundColor: e.target.value,
    }));
  };
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCard((prevCard) => ({
      ...prevCard,
      [name]: value,
    }));
  };
  // Handle input change for social/project links (title and URL)
  const handleLinkChange = (e, index, type) => {
    const { name, value } = e.target;
    const updatedLinks = [...card[type]];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [name]: value,
    };
    setCard((prevCard) => ({
      ...prevCard,
      [type]: updatedLinks,
    }));
  };
  // Add new link input fields
  const addNewLink = (type) => {
    const newLink = type === "cardSocialLinks" ? { title: "", link: "" } : { title: "", link: "" };
    setCard((prevCard) => ({
      ...prevCard,
      [type]: [...prevCard[type], newLink],
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Handle save to backend
  const handleSave = async () => {
    try {
      console.log("Saving Card Data:", card);
      // Send updated card data to the backend
      await axios.put(
        `http://localhost:8080/cards/${id}`,
        { ...card },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response from Server:", response.data);
      alert("Card updated successfully!");
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error saving card data:", error);
      alert("There was an error updating the card.");
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>back</button>

      {/* Card Display */}
      <div style={{ backgroundColor: cardBackgroundColor, padding: "20px", borderRadius: "10px", border: "1px solid black" }}>
        {/* Picture */}
        <div>
          {isEditing ? (
            <input
              type="text"
              name="cardPicture"
              value={cardPicture || ""}
              placeholder="Picture URL"
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
          ) : (
            <img
              src={
                cardPicture ||
                "data:image/png;base64,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" // Default image
              }
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "20px",
              }}
            />
          )}
          {/* About Me */}
          <div>
            <h3>About Me</h3>
            {isEditing ? (
              <textarea
                name="cardAbout"
                value={cardAbout || ""}
                onChange={handleInputChange}
                style={{ width: "100%", height: "60px" }}
              />
            ) : (
              <p>{cardAbout}</p>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          {isEditing ? (
            <>
              <input
                type="text"
                name="cardFirstName"
                value={cardFirstName || ""}
                placeholder="First Name"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="cardLastName"
                value={cardLastName || ""}
                placeholder="Last Name"
                onChange={handleInputChange}
              />
            </>
          ) : (
            <h2>
              {cardFirstName} {cardLastName}
            </h2>
          )}
        </div>

        {/* Social Links */}
        <div>
          <h3>Social Links</h3>
          {isEditing ? (
            <textarea
              name="cardSocialLinks"
              value={JSON.stringify(cardSocialLinks) || ""}
              placeholder='[{"title": "Link1", "link": "https://..."}]'
              onChange={(e) =>
                setCard((prevCard) => ({
                  ...prevCard,
                  cardSocialLinks: JSON.parse(e.target.value || "[]"),
                }))
              }
              style={{ width: "100%" }}
            />
          ) : Array.isArray(cardSocialLinks) && cardSocialLinks.length > 0 ? (
            cardSocialLinks.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"

              >
                {social.title.charAt(0).toUpperCase()}
              </a>
            ))
          ) : (
            <p>No social links available</p>
          )}
        </div>

        {/* Project Links */}
        <div>
          <h3>Project Links</h3>
          {isEditing ? (
            <textarea
              name="cardProjectLinks"
              value={JSON.stringify(cardProjectLinks) || ""}
              placeholder='[{"title": "Project1", "link": "https://..."}]'
              onChange={(e) =>
                setCard((prevCard) => ({
                  ...prevCard,
                  cardProjectLinks: JSON.parse(e.target.value || "[]"),
                }))
              }
              style={{ width: "100%" }}
            />
          ) : Array.isArray(cardProjectLinks) && cardProjectLinks.length > 0 ? (
            cardProjectLinks.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"

              >
                {project.title.charAt(0).toUpperCase()}
              </a>
            ))
          ) : (
            <p>No project links available</p>
          )}
        </div>
        {/* Background Color Picker */}
        <div>
          <label htmlFor="backgroundColor">Choose a background color:</label>
          <input
            type="color"
            id="backgroundColor"
            name="backgroundColor"
            value={cardBackgroundColor || "#FFFFFF"}
            onChange={handleInputChange}
          />
        </div>

        {/* Edit Button */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {isEditing ?
            <button onClick={handleSave}> Save </button> : <button onClick={toggleEditMode}> Edit </button>}
        </div>
      </div>


    </div>
  );
}

export default Card;