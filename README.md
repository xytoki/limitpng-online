# limitpng-online
A online tool to compress PNG file ( ported from https://github.com/nullice/limitPNG )
在线PNG高压工具，移植自https://github.com/nullice/limitPNG
## Backend installation
1. Copy `backend` folder to your server which to do the compression tasks.
把`frontend`文件夹的所有东西拷到后端服务器上
2. Install nodejs and run `npm install`
安装Node.js然后`npm install`
3. copy binary compression tools into `bin` folder
把二进制压缩工具放到`bin`文件夹

>i've prepared binarys for win32 and linux amd64 platform in the `prebuilt-binary` folder. 
windows平台和64位linux平台的文件以及编译好在`prebuilt-binary`文件夹，其他平台需自己编译

## Frontend installation
1. Copy anything in the `frontend` folder to your server
把`frontend`文件夹的所有东西拷到web服务器上
2. Change your server ip in `main.js`
在main.js中修改服务器IP
3. Enjoy! 完工!