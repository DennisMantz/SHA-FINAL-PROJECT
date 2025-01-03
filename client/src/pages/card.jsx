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
    cardEmail: "",
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
    <div className="bg-gray-200 min-h-screen">
      <Navbar />

      <div className="flex">
        <button className="text-white font-bold py-2 px-3 bg-gradient-to-r from-gray-800 to-gray-900 m-1 hover:scale-110 rounded-lg sm:absolute" onClick={() => navigate("/businessCards")}>Back</button>

        {/* CardTittle */}
        <div className="mx-auto w-[400px] mt-3 text-center">
          {isEditing ? (
            <>
              <label htmlFor="cardTitle" className="mr-2 text-gray-700 font-bold">
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
      </div>



      {/* Card Display */}
      <div className="m-3 p-4 border rounded-lg border-gray-800 max-w-[400px] h-[full] mx-auto"
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


          <div
            className={`flex flex-col items-center col-span-2 ${isEditing ? 'space-y-2' : 'space-y-1'}`}>
            {/* first+last name */}
            <div className="mt-3 w-full ">
              {isEditing ? (
                <>
                  <div className="flex gap-2 ">
                    <h2 className="text-gray-700 font-bold ">FirstName:</h2>
                    <input
                      type="text"
                      name="cardFirstName"
                      value={card.cardFirstName}
                      placeholder="First Name"
                      onChange={handleInputChange}
                      className="text-gray-700 "
                      maxLength={25}
                    />
                  </div>
                  <div className="flex gap-2 mt-1">
                    <h2 className="text-gray-700 font-bold">LastName:</h2>
                    <input
                      type="text"
                      name="cardLastName"
                      value={card.cardLastName}
                      placeholder="Last Name"
                      onChange={handleInputChange}
                      className="text-gray-800"
                      maxLength={25}

                    />
                  </div>
                </>
              ) : (
                <h2 className="flex pl-3 text-gray-900 font-bold">
                  {card.cardFirstName} {card.cardLastName}
                </h2>
              )}
            </div>
            {/* About Me Section */}
            {isEditing ? (
              <div className="w-full">
                <h2 className="underline text-gray-700 font-bold">About me</h2>
                <textarea
                  name="cardAbout"
                  value={card.cardAbout}
                  onChange={handleInputChange}
                  className="w-full h-[80px] text-gray-800 border "
                />
              </div>
            ) : (
              <div className=" max-h-[100px] overflow-hidden hover:overflow-auto pl-3">
                <p className="relative break-words whitespace-normal max-w-[300px]">
                  {showFullAbout
                    ? card.cardAbout
                    : `${card.cardAbout.substring(0, 100)}`}
                  {card.cardAbout.length > 100 && (
                    <button
                      onClick={() => setShowFullAbout(!showFullAbout)}
                      className="ml-1 bg-none border-none text-blue-900 text-sm underline cursor-pointer"
                    >
                      {showFullAbout ? 'See less' : 'See More'}
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>


        {/* Social Links */}
        <div className={`${isEditing ? 'mt-3' : 'mt-8'}`}>
        <div className={`mb-2 ${isEditing ? 'flex gap-2' : ' text-center'}`}>
            <h3 className="text-gray-700 font-bold ">Social Links</h3>
            <button
              className={`${isEditing ? 'bg-green-900 rounded-lg text-white w-9 h-7' : 'hidden'}`}
              onClick={() => addNewLink("cardSocialLinks")}>Add</button>
          </div>

          {isEditing ? (
            <>
              {card.cardSocialLinks.map((social, index) => (
                <div className="flex items-center gap-[2px] mb-1" key={index}>
                  <button
                    className="bg-gradient-to-r from-red-800 to-red-900 text-white w-6 h-6 rounded-full"
                    onClick={() => removeLink(index, "cardSocialLinks")}>X</button>
                  <input
                    type="text"
                    placeholder="Title"
                    value={social.title}
                    onChange={(e) =>
                      handleLinkChange(index, "cardSocialLinks", "title", e.target.value)
                    }
                    className=" text-gray-800 border border-gray-300 rounded-md p-1 w-36"
                  />
                  <input
                    type="text"
                    placeholder="example.com"
                    value={social.link}
                    onChange={(e) =>
                      handleLinkChange(index, "cardSocialLinks", "link", e.target.value)
                    }
                    className=" text-gray-800 border border-gray-300 rounded-md p-1 w-36"
                  />
                </div>
              ))}

            </>
          ) : card.cardSocialLinks.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {card.cardSocialLinks.map((social, index) => {
                const validLink = social.link.startsWith("http")
                  ? social.link
                  : `https://${social.link}`; 
                return (
                  <a
                    key={index}
                    href={validLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-auto flex items-center justify-center text-white bg-gray-800 rounded-full w-20 h-20 text-center hover:scale-105"
                    style={{
                      fontSize: `${Math.max(14, 48 / (social.title.length || 1))}px`, // Adjust font size dynamically
                      lineHeight: "1.2", // Maintain good vertical spacing
                    }}
                    title={social.link} // Tooltip for the full title
                  >
                    {social.title.length > 9
                      ? `${social.title.substring(0, 8)}...` // Truncate if too long
                      : social.title}
                  </a>
                );
              })}
            </div>
          ) : (
            null
          )}
        </div>


        {/*  */}
        {/* Project Links */}
        <div className={`${isEditing ? 'mt-3' : 'mt-8'}`}>
          <div className={`mb-2 ${isEditing ? 'flex gap-2' : ' text-center'}`}>
            <h3 className="text-gray-700 font-bold ">Project Links</h3>
            <button className={`${isEditing ? 'bg-green-900 rounded-lg text-white w-9 h-7' : 'hidden'}`}
              onClick={() => addNewLink("cardProjectLinks")}>Add</button>
          </div>

          {isEditing ? (
            <>
              {card.cardProjectLinks.map((project, index) => (
                <div className="flex  items-center gap-[2px] mb-1" key={index}>
                  <button
                    className="bg-gradient-to-r from-red-800 to-red-900 text-white w-6 h-6 rounded-full"
                    onClick={() => removeLink(index, "cardProjectLinks")}>X</button>
                  <input
                    type="text"
                    placeholder="Title"
                    value={project.title}
                    onChange={(e) =>
                      handleLinkChange(index, "cardProjectLinks", "title", e.target.value)
                    }
                    className=" text-gray-800 border border-gray-300 rounded-md p-1 w-36"
                  />
                  <input
                    type="text"
                    placeholder="example.com"
                    value={project.link}
                    onChange={(e) =>
                      handleLinkChange(index, "cardProjectLinks", "link", e.target.value)
                    }
                    className=" text-gray-800 border border-gray-300 rounded-md p-1 w-36"
                  />

                </div>
              ))}

            </>
          ) : card.cardProjectLinks.length > 0 ? (
            <div className="flex flex-wrap gap-3">
            {card.cardProjectLinks.map((project, index) => {
              const validLink = project.link.startsWith("http")
                ? project.link
                : `https://${project.link}`; // Ensure the link has a valid protocol
              return (
                <a
                  key={index}
                  href={validLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" mx-auto flex items-center justify-center text-white bg-gray-800 rounded-full w-20 h-20 text-center hover:scale-105"
                  style={{
                    fontSize: `${Math.max(14, 48 / (project.title.length || 1))}px`, // Adjust font size dynamically
                    lineHeight: "1.2", // Maintain good vertical spacing
                  }}
                  title={project.title} // Tooltip for the full title
                >
                  {project.title.length > 9
                    ? `${project.title.substring(0, 8)}...` // Truncate if too long
                    : project.title}
                </a>
              );
            })}
            </div>
          ) : (
            null
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

        {/* email */}
        <div className="mt-5">
          {isEditing ? (
            <>
              <label htmlFor="cardEmail" className="mr-2 text-gray-700 font-bold">
                Email:
              </label>
              <input
                id="cardEmail"
                type="email"
                name="cardEmail"
                value={card.cardEmail}
                placeholder="Email"
                onChange={handleInputChange}
              />
            </>
          ) : (
            <h2 className="text-gray-900 font-bold text-center">
              {card.cardEmail}
            </h2>
          )}

        </div>



      </div>
      {/* Edit/Save Button */}
      <div className="text-center">
        {isEditing ? (
          <>
            <button className="text-white font-bold py-2 px-3 bg-gradient-to-r from-green-800 to-green-900 hover:scale-110 rounded-lg" onClick={handleSave}>Save</button>
            <button className="text-white font-bold py-2 px-3 bg-gradient-to-r from-red-800 to-red-900 hover:scale-110 rounded-lg" onClick={handleCancel} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </>
        ) : (
          <button className="text-white font-bold py-2 px-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:scale-110 rounded-lg" onClick={toggleEditMode}>Edit</button>
        )}
      </div>
    </div>
  );
}

export default Card;