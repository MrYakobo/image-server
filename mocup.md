## TODO
Promisify everything with async/await.
(big) use folders in imageview (with thumbnails)

To be able to use folders, `walker.js` should upon subdirectory emit to a seperate list, which is later in the UI represented by a folder icon. Upon click, client sends the new root folder to server.

This requires the client having some sense of a path. There should be one at the top.


Implementation:

`GET /cd?path=Jakob/EOS%20M`

The server changes dir. This almost requires a cookie, as I don't wan't to change directory with everyone. Or rather even better, I serve all images as a normal HTTP server, and when the user want to `cd`, I just send out all the content from that folder and then act like normal.

So like this

http://raspberrypi.tk/
|image|
|image|
|image|
|folder| <--- Click

=>

http://raspberrypi.tk/folder/
|image|
|image|
|image|