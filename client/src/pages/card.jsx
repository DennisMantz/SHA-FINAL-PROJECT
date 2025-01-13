import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import { ToastContainer, toast } from 'react-toastify';
import Swal from "sweetalert2";
import QRCode from "qrcode";
// import QrReader from "react-qr-scanner"; // For scanning QR codes

function Card() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); // Access location state
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [qrCode, setQrCode] = useState("");

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
    cardBackgroundColor: "#EDEDED",
  });

  const [textColor, setTextColor] = useState("#000000"); // State for dynamic text color
  const [isEditing, setIsEditing] = useState(location.state?.isEditing || false);
  const [originalCard, setOriginalCard] = useState(null); // Stores the original data for cancellation



  // Utility function to calculate luminance and set appropriate text color
  const calculateTextColor = (backgroundColor) => {
    let r, g, b;

    if (backgroundColor.startsWith("#")) {
      // Handle #RRGGBB format
      r = parseInt(backgroundColor.slice(1, 3), 16);
      g = parseInt(backgroundColor.slice(3, 5), 16);
      b = parseInt(backgroundColor.slice(5, 7), 16);
    } else if (backgroundColor.startsWith("rgb")) {
      // Handle rgb(...) format
      const rgbValues = backgroundColor
        .match(/\d+/g) // Extract numbers
        .map((num) => parseInt(num, 10)); // Convert to integers
      [r, g, b] = rgbValues;
    } else {
      console.error("Invalid color format:", backgroundColor);
      return "#000000"; // Default to black if invalid format
    }

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const textColor = luminance > 128 ? "#000000" : "#FFFFFF";

    // console.log({
    //   backgroundColor,
    //   r,
    //   g,
    //   b,
    //   luminance,
    //   returnedTextColor: textColor,
    // }); // Debugging

    return textColor;
  };

  const adjustColorBrightness = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Calculate luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Decide adjustment amount: lighter colors get darker (-20), darker colors get lighter (+20)
    const amount = luminance > 128 ? -20 : 20;

    // Adjust brightness
    const adjustedR = Math.min(255, Math.max(0, r + amount));
    const adjustedG = Math.min(255, Math.max(0, g + amount));
    const adjustedB = Math.min(255, Math.max(0, b + amount));

    return `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
  };

  // Global calculations for colors using useMemo
  const circleBgColor = useMemo(
    () => adjustColorBrightness(card.cardBackgroundColor), // Adjust brightness dynamically
    [card.cardBackgroundColor] // Only recalculate if background color changes
  );

  const circleTextColor = useMemo(
    () => calculateTextColor(circleBgColor), // Calculate text color based on adjusted background
    [circleBgColor] // Only recalculate if adjusted background changes
  );

  // Fetch card data 
  useEffect(() => {
    const fetchCardData = async () => {

      try {
        const response = await axios.get(`http://localhost:8080/cards/${id}`);
        setCard(response.data);
      } catch (error) {
        console.error("Error fetching card data:", error);
        Swal.fire({
          title: "Error",
          text: "Error loading card data. Please try again.",
          icon: "error",
          confirmButtonText: "Okay",
        });
        navigate("/");
      }
    };

    fetchCardData();
  }, [id, navigate]);



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
    if (card[type].length >= 3) {
      Swal.fire({
        title: "Limit Reached",
        text: "Only 3 links per category.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return; // Exit the function if the limit is reached
    }

    const newLink = { title: "", link: "" }; // Template for new link
    setCard((prevCard) => ({
      ...prevCard,
      [type]: [...prevCard[type], newLink],
    }));
  };
  // Remove a link (social or project) with confirmation
  const removeLink = (index, type) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently remove the link.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedLinks = [...card[type]];
        updatedLinks.splice(index, 1); // Remove the link at the specified index
        setCard((prevCard) => ({
          ...prevCard,
          [type]: updatedLinks,
        }));
        Swal.fire("Removed!", "The link has been removed.", "success");
      }
    });
  };
  const toggleEditMode = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Not Logged In",
        text: "You must be logged in to edit this card.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return;
    }
    setOriginalCard({ ...card });  // Store the original card data
    setIsEditing(!isEditing);
  };

  const validateLinks = (links, type) => {
    let isValid = true;
    const updatedLinks = links.map((link, index) => {
      if (!link.title.trim()) {
        isValid = false;
        toast.error(`Please provide a title for the link`);
        return { ...link, error: true }; // Add an error flag
      }
      return { ...link, error: false }; // Reset error flag if valid
    });
    setCard((prevCard) => ({
      ...prevCard,
      [type === "Primary" ? "cardSocialLinks" : "cardProjectLinks"]: updatedLinks,
    }));
    return isValid;
  };

  // Save changes
  const handleSave = async () => {
    // Validate primary and secondary links
    if (!validateLinks(card.cardSocialLinks, "Primary") || !validateLinks(card.cardProjectLinks, "Secondary")) {
      return; // Stop the save operation if validation fails
    }

    // Proceed with save if validation passes
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save your changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
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
          // alert("Card updated successfully!");
          setIsEditing(false);
        } catch (error) {
          console.error("Error saving card data:", error);
          toast("There was an error updating the card.");
        }
      }
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Any unsaved changes will be lost. Do you want to cancel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditing(false); // Exit editing mode
        if (originalCard) {
          setCard(originalCard); // Revert to original card data
        }
        // Swal.fire("Cancelled", "Your changes have been discarded.", "info");
      }
    });
  };


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
        // alert("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error.message);
        toast("Image upload failed.");
      }
    };

    if (file) {
      reader.readAsDataURL(file); // Convert file to Base64
    } else {
      toast("Please select a file to upload.");
    }
  };
  // Function to generate QR code
  const generateQRCode = async () => {
    const cardUrl = `${window.location.origin}/cards/${id}`; // Construct card URL
    const qrImage = await QRCode.toDataURL(cardUrl); // Generate QR code image
    setQrCode(qrImage); // Set the QR code image
  };


  return (
    <main className="bg-gray-200 min-h-screen ">
      {localStorage.getItem("token") && (<Navbar />)}

      <div className="flex justify-end max-w-[480px] mx-auto relative">
        {/* Card Title */}
        <div className={`mt-3 ${isEditing ? 'mx-auto' : 'justify-end'}`}>
          {/*  className={`flex flex-col items-center col-span-2 ${isEditing ? 'space-y-2' : 'space-y-1'}`}> */}
          {isEditing ? (
            <>
              <label
                htmlFor="cardTitle"
                className="mr-2 font-bold text-black"
              >
                Card Name:
              </label>
              <input
                id="cardTitle"
                type="text"
                name="cardTitle"
                value={card.cardTitle}
                placeholder="Only you can see this"
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 text-black"
                maxLength={16}
              />
            </>
          ) : (
            localStorage.getItem("token") && (
              <div className="">
                <button
                  className=" hover:scale-110  absolute left-[429px] top-[6px]"
                  onClick={() => navigate("/Cards")}
                >
                  <img src="/assets/circle-xmark-solid-sm-back.svg" alt="Back" className="w-8 h-8" />
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Card Display */}
      <div className="m-3 p-4 border rounded-lg border-gray-800 max-w-[400px] h-[full] mx-auto "
        style={{
          backgroundColor: card.cardBackgroundColor,
          color: textColor, // Dynamically applied text color
        }}
      >

        {isEditing ? (
          <div
            className=" mb-4 max-w-[200px] mx-auto hover:scale-110">
            <button
              type="button"
              className=" "

              onClick={() => document.getElementById('backgroundColor').click()} // Programmatically trigger the input
            >
              🎨
            </button>
            <label

              htmlFor="backgroundColor"
              className="font-bold"
              style={{
                color: `${circleTextColor}`,
              }}
            >
              Background Color
            </label>
            <div className="relative inline-block">
              {/* Hidden Color Input */}
              <input
                type="color"
                id="backgroundColor"
                name="cardBackgroundColor"
                value={card.cardBackgroundColor}
                onChange={(e) => {
                  handleInputChange(e); // Update the card background color
                  setTextColor(calculateTextColor(e.target.value)); // Recalculate text color dynamically
                }}
                className="opacity-0 absolute w-full h-full cursor-pointer" // Make the input invisible but clickable
                style={{ top: 0, left: 0 }}
              />
              {/* Visible Icon */}
              <button
                type="button"
                className=" "

                onClick={() => document.getElementById('backgroundColor').click()} // Programmatically trigger the input
              >
                🎨
              </button>
            </div>
          </div>
        ) : null}



        <div>
          {/* Picture Section */}
          <div className="flex justify-center ">
            {isEditing ? (
              <>
                <input
                  type="file" //default behavior of HTML -> Choose File : No file chosen
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className=""
                  style={{
                    color: `${circleTextColor} `
                  }}
                />
              </>
            ) : (
              <img
                src={card.cardPicture}
                alt="Profile"
                className="w-[200px] rounded-full object-cover  "
              />
            )}
          </div>


          <div
            className={`flex flex-col items-center col-span-2 ${isEditing ? 'space-y-2' : 'space-y-1'}`}>
            {/* first+last name */}
            <div className="mt-3 w-full ">
              {isEditing ? (
                <>
                  <div className="flex gap-2 mt-1 items-center">
                    <h2
                      className=" font-bold w-28"
                      style={{
                        color: `${circleTextColor} `
                      }}>FirstName:</h2>
                    <input
                      type="text"
                      name="cardFirstName"
                      value={card.cardFirstName}
                      placeholder="First Name"
                      onChange={handleInputChange}
                      className=" flex-1 border border-gray-300 rounded px-2 py-1 text-black"
                      maxLength={22}
                    />
                  </div>
                  <div className="flex gap-2 mt-1 items-center">
                    <h2
                      className=" font-bold w-28"
                      style={{
                        color: `${circleTextColor} `
                      }}>LastName:</h2>
                    <input
                      type="text"
                      name="cardLastName"
                      value={card.cardLastName}
                      placeholder="Last Name"
                      onChange={handleInputChange}
                      className=" flex-1 border border-gray-300 rounded px-2 py-1 text-black"
                      maxLength={22}

                    />
                  </div>
                </>
              ) : (
                <h2
                  className="flex w-full justify-center  font-bold"
                  style={{
                    color: `${circleTextColor} `
                  }}>
                  {card.cardFirstName} {card.cardLastName}
                </h2>
              )}
            </div>
            {/* About Me Section */}
            {isEditing ? (
              <div className="w-full">
                <h2
                  className="underline  font-bold"
                  style={{
                    color: `${circleTextColor} `
                  }}>About me</h2>
                <textarea
                  name="cardAbout"
                  value={card.cardAbout}
                  onChange={handleInputChange}
                  className="w-full h-[80px]  border text-black border-gray-300 rounded"
                />
              </div>
            ) : (
              <div className=" max-h-[100px] overflow-hidden hover:overflow-auto pl-3">
                <p
                  className="relative break-words whitespace-normal max-w-[300px]"
                  style={{
                    color: `${circleTextColor} `
                  }}>

                  {showFullAbout
                    ? card.cardAbout
                    : `${card.cardAbout.substring(0, 100)}`}
                  {card.cardAbout.length > 100 && (
                    <button
                      onClick={() => setShowFullAbout(!showFullAbout)}
                      className="ml-1 bg-none border-none text-blue-900 text-sm underline cursor-pointer"
                      style={{
                        color: `${circleTextColor} `
                      }}>
                      {showFullAbout ? 'See less' : 'See More'}
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>


        {/* Social Links */}
        <div className="mt-3">
          {isEditing ? (
            <>
              <div className="mb-2 flex gap-2" >
                <h3
                  title="ex. Social links"
                  className="font-bold text-xl cursor-help"
                  style={{
                    color: `${circleTextColor} `
                  }}>Primary Links</h3>
                <button
                  title={`${card.cardSocialLinks.length >= 3 ? "3 links /section" : "Add Link"}`}
                  onClick={() => addNewLink("cardSocialLinks")}
                  className={`rounded-full bg-white w-7 h-7  ${card.cardSocialLinks.length >= 3 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <img src="/assets/circle-plus-sm.svg" alt="Add Link" className=" w-7 h-7 rounded-full" />
                </button>

              </div>
              {card.cardSocialLinks.map((social, index) => (
                <div className="flex items-center gap-[2px] mb-1" key={index}>

                  <input
                    title="Title: required"
                    type="text"
                    placeholder="Title"
                    value={social.title}
                    onChange={(e) => handleLinkChange(index, "cardSocialLinks", "title", e.target.value)}

                    className={`border border-gray-300 rounded-md p-1 w-36 text-black ${social.error ? "border-red-500" : ""}`}
                  />
                  <input
                    title="Link"
                    type="text"
                    placeholder="example.com"
                    value={social.link}
                    onChange={(e) =>
                      handleLinkChange(index, "cardSocialLinks", "link", e.target.value)
                    }
                    className="  border border-gray-300 rounded-md p-1 w-36 text-black"
                  />

                  <button
                    title="Remove Link"
                    onClick={() => removeLink(index, "cardSocialLinks")}
                    className=" rounded-full bg-white "
                  >
                    <img src="/assets/ban-solid-sm.svg" alt="Remove Link" className="w-6 h-6" />
                  </button>
                </div>

              ))}

            </>
          ) : card.cardSocialLinks.length > 0 ? (
            <div className="flex flex-wrap gap-3 max-w-[300px] mx-auto">
              {card.cardSocialLinks.map((social, index) => {

                // console.log("Adjusted Background Color:", circleBgColor);
                const validLink = social.link.startsWith("http")
                  ? social.link
                  : `https://${social.link}`;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      Swal.fire({
                        title: `Go to ${social.link}?`,
                        text: "You will be redirected to the external link.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, proceed",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          window.open(validLink, "_blank", "noopener,noreferrer");
                        }
                      });
                    }}
                    className="mx-auto flex items-center justify-center border-2 rounded-full w-20 h-20 text-center hover:scale-105"
                    style={{
                      backgroundColor: circleBgColor,
                      borderColor: `${circleTextColor}`,
                      color: `${circleTextColor}`, // Dynamically calculated text color
                      fontSize: 14,
                      lineHeight: "1.2",
                    }}
                    title={social.link} // Tooltip for the full title
                  >
                    {social.title.length > 9
                      ? `${social.title.substring(0, 8)}...` // Truncate if too long
                      : social.title}
                  </button>
                );
              })}
            </div>
          ) : (
            null
          )}
        </div>



        {/* Project Links */}
        <div className={`${isEditing ? 'mt-3' : 'mt-8'}`}>


          {isEditing ? (
            <>
              <div className="mb-2 flex gap-2" >
                <h3
                  title="ex. Project links"
                  className="font-bold text-xl cursor-help"
                  style={{
                    color: `${circleTextColor} `

                  }}>Secondary Links</h3>

                <button
                  title={`${card.cardProjectLinks.length >= 3 ? "3 links /section" : "Add Link"}`}
                  onClick={() => addNewLink("cardProjectLinks")}

                  className={`rounded-full bg-white w-7 h-7 ${card.cardProjectLinks.length >= 3 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <img src="/assets/circle-plus-sm.svg" alt="Add Link" className="bg-white w-7 h-7 rounded-full" />
                </button>

              </div>
              {card.cardProjectLinks.map((project, index) => (
                <div className="flex  items-center gap-[2px] mb-1" key={index}>
                  <input
                    title="Title: required"
                    type="text"
                    placeholder="Title"
                    value={project.title}
                    onChange={(e) =>
                      handleLinkChange(index, "cardProjectLinks", "title", e.target.value)
                    }
                    className={`border border-gray-300 rounded-md p-1 w-36 text-black ${project.error ? "border-red-500" : ""}`}
                  />

                  <input
                    title="Link"
                    type="text"
                    placeholder="example.com"
                    value={project.link}
                    onChange={(e) =>
                      handleLinkChange(index, "cardProjectLinks", "link", e.target.value)
                    }
                    className="  border border-gray-300 rounded-md p-1 w-36 text-black"
                  />
                  <button
                    title="Remove Link"
                    onClick={() => removeLink(index, "cardProjectLinks")}
                    className=" rounded-full bg-white"
                  >
                    <img src="/assets/ban-solid-sm.svg" alt="Remove Link" className="w-6 h-6" />
                  </button>


                </div>
              ))}

            </>
          ) : card.cardProjectLinks.length > 0 ? (
            <div className="flex flex-wrap gap-3 max-w-[300px] mx-auto">
              {card.cardProjectLinks.map((project, index) => {

                const validLink = project.link.startsWith("http")
                  ? project.link
                  : `https://${project.link}`; // Ensure the link has a valid protocol
                return (
                  <button
                    key={index}
                    onClick={() => {
                      Swal.fire({
                        title: `Go to ${project.link}?`,
                        text: "You will be redirected to the external link.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, proceed",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          window.open(validLink, "_blank", "noopener,noreferrer");
                        }
                      });
                    }}
                    className="mx-auto flex items-center justify-center border-2 rounded-full w-20 h-20 text-center hover:scale-105"
                    style={{
                      backgroundColor: circleBgColor,
                      borderColor: `${circleTextColor}`,
                      color: `${circleTextColor}`, // Dynamically calculated text color
                      fontSize: 14,
                      lineHeight: "1.2",
                    }}
                    title={project.link} // Tooltip for the full title
                  >
                    {project.title.length > 9
                      ? `${project.title.substring(0, 8)}...` // Truncate if too long
                      : project.title}
                  </button>
                );
              })}
            </div>
          ) : (
            null
          )}
        </div>

        {/* email */}
        <div className="mt-5">
          {isEditing ? (
            <>
              <label htmlFor="cardEmail" className="mr-2  font-bold"
                style={{
                  color: `${circleTextColor} `
                }}>
                Email:
              </label>
              <input
                id="cardEmail"
                type="email"
                name="cardEmail"
                value={card.cardEmail}
                placeholder="Email Address"
                onChange={handleInputChange}
                className="text-black"
              />
            </>
          ) : (
            <h2 className=" font-bold text-center"
              style={{
                color: `${circleTextColor} `
              }}>
              {card.cardEmail}
            </h2>
          )}

        </div>



      </div>

      <div className="text-center">
        {isEditing ? (
          <>
            <button
              className="text-white font-bold py-2 px-3 bg-gradient-to-r from-green-800 to-green-900 hover:scale-110 rounded-lg"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="text-white font-bold py-2 px-3 bg-gradient-to-r from-red-800 to-red-900 hover:scale-110 rounded-lg ml-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <div>
            {/* Buttons Section */}
            <div className="flex justify-center space-x-4 mt-2 max-w-[400px] mx-auto">
              {localStorage.getItem("token") && (
                <>
                  <button
                    className="text-white font-bold py-2 px-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:scale-110 rounded-lg"
                    onClick={toggleEditMode}
                  >
                    Edit
                  </button>
                  <button
                    className="text-white font-bold py-2 px-3 bg-gradient-to-b from-blue-900 to-blue-800 hover:scale-110 rounded-lg"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                        .then(() => {
                          Swal.fire({
                            title: "Copied!",
                            text: "Card URL has been copied to the clipboard.",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                          });
                        })
                        .catch(() => {
                          Swal.fire({
                            title: "Error!",
                            text: "Failed to copy the URL. Please try again.",
                            icon: "error",
                            timer: 1600,
                            showConfirmButton: false,
                          });
                        });
                    }}
                  >
                    Copy URL
                  </button>
                </>
              )}
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center mt-6 mx-auto w-full max-w-[400px]">
              {localStorage.getItem("token") && (
                !qrCode ? (
                  <button
                    onClick={generateQRCode}
                    className="text-white font-bold py-2 px-3 bg-gradient-to-b from-blue-900 to-blue-800 hover:scale-105 rounded-lg"
                  >
                    QR Code
                  </button>
                ) : (
                  <div className="mt-4 flex flex-col items-center justify-center">
                    <img
                      src={qrCode}
                      alt="Card QR Code"
                      className="w-48 h-48 rounded-lg border-2 border-gray-800 shadow-lg"
                    />
                    <p className="mt-2 text-gray-700 font-semibold">Scan ME!</p>
                  </div>
                )
              )}
            </div>
            {/* Navigation option to /Register when not logged in */}
            <div>
              {!localStorage.getItem("token") && (
                <>
                  <p className="text-gray-800 font-bold text-xl">Sign up to create your own unique cards</p>
                  <button
                    className="py-2 px-3 bg-gray-800 hover:scale-110 rounded-3xl mt-4"
                  >
                    <img
                      onClick={() => navigate("/register")}
                      className="h-[150px] xl:h-[180px] hover:scale-110 p-4"
                      src="/assets/syncBro-WHITE-ALIGNED.png"
                      alt="logo"
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>


      <ToastContainer
        position="top-center" // Set notification position globally
        autoClose={1500} // Auto close in 3 seconds
        hideProgressBar={false} // Show progress bar
        newestOnTop={false} // Notifications will stack oldest-to-newest
        closeOnClick // Close on click
        rtl={false} // Left-to-right layout
        pauseOnFocusLoss={false} // Pause when browser loses focus
        draggable={false} // Allow dragging the notification
        pauseOnHover={false} // Pause timer on hover
      />
    </main>
  );
}

export default Card;