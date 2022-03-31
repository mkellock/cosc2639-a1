// using Google.Cloud.Storage.V1;
// using Microsoft.Extensions.FileProviders;
// using SixLabors.ImageSharp;
// using SixLabors.ImageSharp.Processing;

// // Load the image into a memory stream
// using var image = Image.Load("/Users/mattkellock/Desktop/download.jpeg");

// int newWidth;
// int newHeight;
// MemoryStream file = new MemoryStream();

// if (image.Height < image.Width)
// {
//     newHeight = 120;
//     newWidth = image.Width * (120 / image.Height);
// }
// else
// {
//     newWidth = 120;
//     newHeight = image.Height * (120 / image.Width);
// }

// image.Mutate(x =>
// {
//     x.Resize(newWidth, newHeight);
//     x.Crop(120, 120);
// });


// image.SaveAsGif(file);

// var gcsStorage = StorageClient.Create();
// gcsStorage.UploadObject("user_images_cosc2639", "upload.gif", null, file);
// Console.WriteLine($"Uploaded upload.gif.");

using System;
using Google.Cloud.Datastore.V1;

var username = "Matt Kellock 8";
var password = "890123";

DatastoreDb db = DatastoreDb.Create("cosc2639-assignment-1");

Google.Cloud.Datastore.V1.Query query = new("user")
{
    Filter = Filter.And(new[] { Filter.Equal("user_name", username), Filter.Equal("password", password) }),
    Limit = 1
};

foreach (Entity entity in  db.RunQueryLazily(query)) {
    Console.WriteLine(entity["id"]);
}

// if (results.Entities.Count > 0)
// {
//     return new User()
//     {
//         Id = (string)results.Entities[0]["id"],
//         Username = (string)results.Entities[0]["username"]
//     };
// }
// else
// {
//     throw new Exception("Username or password is incorrect, or user is not a valid user");
// }

// public class User
// {
//     public User()
//     {
//         Id = "";
//         Username = "";
//     }

//     public string Id { get; set; }
//     public string Username { get; set; }
// }