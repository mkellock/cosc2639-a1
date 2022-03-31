using System;
using System.Collections;
using Google.Cloud.Datastore.V1;
using Google.Cloud.Storage.V1;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace api
{
    public class Message
    {
        public Message()
        {
            Id = 0;
            Subject = "";
            Contents = "";
            Username = "";
        }

        public int Id { get; set; }
        public string Subject { get; set; }
        public string Contents { get; set; }
        public string Username { get; set; }
        public DateTime PostTime { get; set; }
    }

    public class User
    {
        public User()
        {
            Id = "";
            Username = "";
        }

        public string Id { get; set; }
        public string Username { get; set; }
    }

    public class Helpers
    {
        public Entity? UserEntityByUsernamePassword(string username, string password)
        {
            DatastoreDb db = DatastoreDb.Create("cosc2639-assignment-1");

            Google.Cloud.Datastore.V1.Query query = new("user")
            {
                Filter = Filter.And(new[] { Filter.Equal("user_name", username), Filter.Equal("password", password) }),
                Limit = 1
            };

            IReadOnlyList<Entity> result = db.RunQuery(query).Entities;

            if (result.Count > 0) return result[0];
            else return null;
        }

        public Entity? UserEntityByUsername(string username)
        {
            DatastoreDb db = DatastoreDb.Create("cosc2639-assignment-1");

            Google.Cloud.Datastore.V1.Query query = new("user")
            {
                Filter = Filter.Equal("user_name", username),
                Limit = 1
            };

            IReadOnlyList<Entity> result = db.RunQuery(query).Entities;

            if (result.Count > 0) return result[0];
            else return null;
        }
    }

    public class Query
    {
        public List<Message> AllMessages()
        {
            List<Message> returnMessages = new();

            DatastoreDb db = DatastoreDb.Create("cosc2639-assignment-1");

            Google.Cloud.Datastore.V1.Query query = new("message");

            foreach (Entity entity in db.RunQuery(query).Entities)
            {
                returnMessages.Add(new Message
                {
                    Id = (int)entity["id"],
                    Subject = (string)entity["subject"],
                    Contents = (string)entity["contents"],
                    Username = (string)entity["user_name"],
                    PostTime = new DateTime().AddTicks((long)entity["post_time"])
                });
            }

            return returnMessages;
        }

        public User? UserByUsernamePassword(string username, string password)
        {
            Helpers helper = new();

            Entity? user = helper.UserEntityByUsernamePassword(username, password);

            if (user != null)
            {
                User returnUser = new();
                returnUser.Id = (string)user["id"];
                returnUser.Username = (string)user["user_name"];
                return returnUser;
            }

            return null;
        }
    }

    public class Mutation
    {
        public Boolean UpdatePassword(string username, string oldPassword, string newPassword)
        {
            Helpers helper = new();

            Entity? user = helper.UserEntityByUsernamePassword(username, oldPassword);

            if (user == null)
            {
                return false;
            }
            else
            {
                DatastoreDb db = DatastoreDb.Create("cosc2639-assignment-1");

                user["password"] = newPassword;

                db.Update(user);

                return true;
            }
        }

        public Boolean Message(int? id, string subject, string contents, string username, string? image)
        {
            DatastoreDb db = DatastoreDb.Create("cosc2639-assignment-1");
            Entity message = new();
            Random random = new();
            Boolean newMessage = id == null;
            KeyFactory keyFactory = db.CreateKeyFactory("message");

            if (id != null)
            {
                Google.Cloud.Datastore.V1.Query query = new("message")
                {
                    Filter = Filter.Equal("id", id),
                    Limit = 1
                };

                message = db.RunQuery(query).Entities[0];
            }
            else
            {
                message.Key = keyFactory.CreateIncompleteKey();
                message["id"] = random.Next(int.MaxValue);
            }

            message["subject"] = subject;
            message["contents"] = contents;
            message["user_name"] = username;
            message["post_time"] = DateTime.UtcNow.Ticks;

            if (image != null)
            {
                SaveImage(image, "m" + ((int)message["id"]).ToString() + ".png");
            }

            if (newMessage)
            {
                db.Insert(message);
            }
            else
            {
                db.Update(message);
            }

            return true;
        }

        public bool RegisterUser(string id, string username, string password, string image)
        {
            DatastoreDb db = DatastoreDb.Create("cosc2639-assignment-1");
            Entity user = new();
            KeyFactory keyFactory = db.CreateKeyFactory("user");
            Helpers helper = new();

            Entity? existingUser = helper.UserEntityByUsername(username);

            if (existingUser == null)
            {
                SaveImage(image, id + ".gif");

                user.Key = keyFactory.CreateIncompleteKey();
                user["id"] = id;
                user["user_name"] = username;
                user["password"] = password;

                db.Insert(user);

                return true;
            }
            else return false;
        }

        private static void SaveImage(string image, string fileName)
        {
            // Decode the Base64 file and load into a bitmap
            var fileContents = Convert.FromBase64String(image[(image.IndexOf("base64,") + 7)..]);

            // Load the image into a memory stream then into a bitmap
            using var bitmap = Image.Load(new MemoryStream(fileContents));

            // Calculate the new image size
            int newWidth;
            int newHeight;

            if (bitmap.Height < bitmap.Width)
            {
                newHeight = 120;
                newWidth = bitmap.Width * (120 / bitmap.Height);
            }
            else
            {
                newWidth = 120;
                newHeight = bitmap.Height * (120 / bitmap.Width);
            }

            // Resize and crop the image
            bitmap.Mutate(x =>
            {
                x.Resize(newWidth, newHeight);
                x.Crop(120, 120);
            });

            // Save the file to a memory stream
            MemoryStream file = new();

            if (fileName.EndsWith("png"))
                bitmap.SaveAsPng(file);
            else
                bitmap.SaveAsGif(file);

            // Save the image file to GCP
            var gcsStorage = StorageClient.Create();
            gcsStorage.UploadObject("user_images_cosc2639", fileName, null, file);
        }
    }
}