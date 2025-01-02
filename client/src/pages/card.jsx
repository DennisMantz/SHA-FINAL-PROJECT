import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";

function Card() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showFullAbout, setShowFullAbout] = useState(false);

  // State for card data
  const [card, setCard] = useState({
    cardTitle: "",
    cardFirstName: "",
    cardLastName: "",
    cardPicture: "",
    cardAbout: "This is a brief about me section.",
    cardSocialLinks: [],
    cardProjectLinks: [],
    cardBackgroundColor: "#FFFFFF",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalCard, setOriginalCard] = useState(null); // Stores the original data for cancellation

  // Fetch card data 
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


  // //check how to reduce code here
  // const {
  //   cardTitle = "",
  //   cardFirstName = "",
  //   cardLastName = "",
  //   cardPicture = "",
  //   cardAbout = "",
  //   cardSocialLinks = [],
  //   cardProjectLinks = [],
  //   cardBackgroundColor = "#FFFFFF",
  // } = card;


  // //check how to reduce code here
  // // const handleBackgroundColorChange = (e) => {
  // //   setCard((prevCard) => ({
  // //     ...prevCard,
  // //     cardBackgroundColor: e.target.value,
  // //   }));
  // // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCard((prevCard) => ({
      ...prevCard,
      [name]: value,
    }));
  };
  // Handle changes to social or project links
  const handleLinkChange = (index, type, field, value) => {
    const updatedLinks = [...card[type]];
    updatedLinks[index][field] = value;
    setCard((prevCard) => ({
      ...prevCard,
      [type]: updatedLinks,
    }));
  };
  // Add a new link (social or project)
  const addNewLink = (type) => {
    const newLink = { title: "", link: "" };
    setCard((prevCard) => ({
      ...prevCard,
      [type]: [...prevCard[type], newLink],
    }));
  };
  // Remove a link (social or project)
  const removeLink = (index, type) => {
    const updatedLinks = [...card[type]];
    updatedLinks.splice(index, 1);
    setCard((prevCard) => ({
      ...prevCard,
      [type]: updatedLinks,
    }));
  };

  const toggleEditMode = () => {
    setOriginalCard({ ...card }); // Store the original card data
    setIsEditing(!isEditing);
  };


  // Save changes
  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8080/cards/${id}`,
        { ...card },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Card updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving card data:", error);
      alert("There was an error updating the card.");
    }
  };

  const handleCancel = () => {
    setCard(originalCard); // Revert to the original card data
    setIsEditing(false);
  };


  // const handleImageUpload = async (file) => {
  //   const formData = new FormData();
  //   formData.append("image", file);

  //   try {
  //     const response = await axios.post(
  //       `http://localhost:8080/cards/${id}/upload-image`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     const updatedCard = response.data.card;

  //     // Update the card state
  //     setCard((prevCard) => ({ ...prevCard, cardPicture: updatedCard.cardPicture }));
  //     alert("Image uploaded successfully!");
  //   } catch (error) {
  //     console.error("Error uploading image:", error.message);
  //     alert("Image upload failed.");
  //   }
  // };

  const handleImageUpload = async (file) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result;

      try {
        const response = await axios.post(
          `http://localhost:8080/cards/${id}/upload-image`, // Include the card ID
          { image: base64Image },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const updatedCard = response.data.card;

        // Update the card state
        setCard((prevCard) => ({ ...prevCard, cardPicture: updatedCard.cardPicture }));
        alert("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error.message);
        alert("Image upload failed.");
      }
    };

    if (file) {
      reader.readAsDataURL(file); // Convert file to Base64
    } else {
      alert("Please select a file to upload.");
    }
  };


  return (
    <div>
      <Navbar />

      <button onClick={() => navigate("/businessCards")}>Back</button>


      {/* CardTittle */}
      <div className="mx-auto w-[400px] p-4">
        {isEditing ? (
          <>
            <label htmlFor="cardTitle" className="mr-2">
              Card Name:
            </label>
            <input
              id="cardTitle"
              type="text"
              name="cardTitle"
              value={card.cardTitle}
              placeholder="Name this Card"
              onChange={handleInputChange}
            />
          </>
        ) : null}
      </div>




      {/* Card Display */}
      <div className="m-3 p-4 border rounded-lg border-gray-800 w-[400px] h-[550px] mx-auto"
        style={{
          backgroundColor: card.cardBackgroundColor,
        }}
      >

        <div className={`grid ${isEditing ? 'grid-cols-1 gap-6' : 'grid-cols-3'} items-center`}>
          {/* Picture Section */}
          <div className="">
            {isEditing ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="text-gray-800 "
                />
              </>
            ) : (
              <img
                src={card.cardPicture}
                alt="Profile"
                className="w-[200px] rounded-full object-cover"
              />
            )}
          </div>

          {/* About Me Section */}
          <div
            className={`flex flex-col items-center col-span-2 ${isEditing ? 'space-y-2' : 'space-y-1'}`}>
            <h3 className="text-gray-800">About Me:</h3>
            {isEditing ? (
              <textarea
                name="cardAbout"
                value={card.cardAbout}
                onChange={handleInputChange}
                className="w-full h-[80px] text-gray-800 border "
              />
            ) : (
              <div className="relative max-h-[100px] overflow-hidden hover:overflow-auto pl-3">
                <p className="break-words whitespace-normal max-w-[300px]">
                  {showFullAbout
                    ? card.cardAbout
                    : `${card.cardAbout.substring(0, 100)}`}
                  {card.cardAbout.length > 100 && (
                    <button
                      onClick={() => setShowFullAbout(!showFullAbout)}
                      className="ml-1 bg-none border-none text-gray-800 underline cursor-pointer"
                    >
                      {showFullAbout ? 'See Less' : 'See More'}
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* first+last name */}
        <div className="mt-3">
          {isEditing ? (
            <>
              <div className="flex gap-2">
                <h2>First Name:</h2>
                <input
                  type="text"
                  name="cardFirstName"
                  value={card.cardFirstName}
                  placeholder="First Name"
                  onChange={handleInputChange}
                  className="text-gray-800"
                />
              </div>
              <div className="flex gap-2 mt-1">
                <h2>Last Name:</h2>
                <input
                  type="text"
                  name="cardLastName"
                  value={card.cardLastName}
                  placeholder="Last Name"
                  onChange={handleInputChange}
                  className="text-gray-800"
                />
              </div>
            </>
          ) : (
            <h2>
              {card.cardFirstName} {card.cardLastName}
            </h2>
          )}
        </div>


        {/* Social Links */}
        <div className="gap-2 mt-3">
          <h3>Social Links</h3>
          {isEditing ? (
            <>
              {card.cardSocialLinks.map((social, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={social.title}
                    onChange={(e) =>
                      handleLinkChange(index, "cardSocialLinks", "title", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Link"
                    value={social.link}
                    onChange={(e) =>
                      handleLinkChange(index, "cardSocialLinks", "link", e.target.value)
                    }
                  />
                  <button onClick={() => removeLink(index, "cardSocialLinks")}>Remove</button>
                </div>
              ))}
              <button onClick={() => addNewLink("cardSocialLinks")}>Add Social Link</button>
            </>
          ) : card.cardSocialLinks.length > 0 ? (
            card.cardSocialLinks.map((social, index) => {
              const validLink = social.link.startsWith("http")
                ? social.link
                : `https://${social.link}`; // Ensure the link has a valid protocol
              return (
                <a
                  key={index}
                  href={validLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", marginBottom: "5px", color: "blue", textDecoration: "underline" }}
                >
                  {social.title}
                </a>
              );
            })
          ) : (
            <p>No social links available.</p>
          )}
        </div>

        {/* Project Links */}
        <div className="mt-3">
          <h3>Project Links</h3>
          {isEditing ? (
            <>
              {card.cardProjectLinks.map((project, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={project.title}
                    onChange={(e) =>
                      handleLinkChange(index, "cardProjectLinks", "title", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Link (e.g., https://example.com)"
                    value={project.link}
                    onChange={(e) =>
                      handleLinkChange(index, "cardProjectLinks", "link", e.target.value)
                    }
                  />
                  <button onClick={() => removeLink(index, "cardProjectLinks")}>Remove</button>
                </div>
              ))}
              <button onClick={() => addNewLink("cardProjectLinks")}>Add Project Link</button>
            </>
          ) : card.cardProjectLinks.length > 0 ? (
            card.cardProjectLinks.map((project, index) => {
              const validLink = project.link.startsWith("http")
                ? project.link
                : `https://${project.link}`; // Ensure the link has a valid protocol
              return (
                <a
                  key={index}
                  href={validLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", marginBottom: "5px", color: "blue", textDecoration: "underline" }}
                >
                  {project.title}
                </a>
              );
            })
          ) : (
            <p>No project links available.</p>
          )}
        </div>

        {/* Background Color Picker */}
        {/* <div>
          {isEditing ? (
            <>
              <label htmlFor="backgroundColor">Background Color:</label>
              <input
                type="color"
                id="backgroundColor"
                name="cardBackgroundColor"
                value={card.cardBackgroundColor}
                onChange={handleInputChange}
              />
            </>
          ) : null}
        </div> */}


      </div>
      {/* Edit/Save Button */}
      <div style={{ marginTop: "5px", textAlign: "center" }}>
        {isEditing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </>
        ) : (
          <button onClick={toggleEditMode}>Edit</button>
        )}
      </div>
    </div>
  );
}

export default Card;