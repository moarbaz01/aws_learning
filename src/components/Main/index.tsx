"use client";

import { ChangeEvent, useState } from "react";

export default function Main() {
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // Handle Change
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      try {
        setLoading(true);
        const response = await fetch(
          `/api/pre-signed-url-upload?key=${file.name}`
        );

        // Check if the response is okay
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || "Upload failed");
        }
        const { result: url } = await response.json();

        const uploadImage = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        if (!uploadImage.ok) {
          throw new Error("Upload failed");
        }

        alert("File uploaded successfully");
      } catch (error: any) {
        console.error("Upload error:", error);
        alert("Error Uploading: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteFile = async () => {
    if (key) {
      const result = await fetch("/api/images", {
        method: "DELETE",
        body: JSON.stringify({ key }),
      });

      if (!result.ok) {
        return alert("Error deleting file");
      }
      const data = await result.json();
      console.log("Here is your data : ", data);
      alert("File deleted successfully");
    }
  };

  const getFile = async () => {
    if (key) {
      console.log(key);
      const result = await fetch(`/api/images?key=${key}`);

      if (!result.ok) {
        return alert("Error getting file");
      }
      const data = await result.json();
      setImages((prev) => [...prev, data.result]);
    }
  };

  const downloadImage = (url: string) => {
    try {
      const link = document.createElement("a");
      link.href = url.toString();

      // Extracting the filename from the URL
      const filename = url.split("/").pop(); // Get the last part of the URL
      link.download = filename || "file"; // Set the name for the downloaded file

      document.body.appendChild(link); // Append link to the body
      link.click(); // Trigger the download
      document.body.removeChild(link); // Remove the link after download
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      <input
        onChange={handleChange}
        type="file"
        hidden
        id="imagefile"
        accept="image/*" // Optional: restricts file types to images only
      />
      <label
        htmlFor="imagefile"
        className="bg-blue-600 text-white rounded-md cursor-pointer hover:opacity-60 transition py-2 px-6"
      >
        Upload File
      </label>

      {/* Delete file */}
      <div className="flex items-center flex-col justify-center gap-2 mt-4">
        <input
          type="text"
          id="key"
          className=" py-2 px-6 border rounded-md"
          placeholder="enter key of file"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button
          className="bg-red-600 text-white rounded-md cursor-pointer hover:opacity-60 transition py-2 px-6"
          onClick={deleteFile}
        >
          Delete file
        </button>
        <button
          className="bg-green-600 text-white rounded-md cursor-pointer hover:opacity-60 transition py-2 px-6"
          onClick={getFile}
        >
          Get file
        </button>
      </div>
      <div className="mt-12 flex items-center flex-wrap gap-4">
        {images.map((image, index) => (
          <div key={index} onClick={() => downloadImage(image)}>
            <img className="h-[200px]" src={image} alt="Uploaded Image" />
          </div>
        ))}
      </div>
    </div>
  );
}
