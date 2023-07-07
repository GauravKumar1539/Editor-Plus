
onload = function () {
    const editor = document.getElementById("editor");
    const context = editor.getContext("2d");
    const toolbar = document.getElementById("toolbar");

    // function to call events from tools according to their ids
    for(let button of toolbar.children){
        if(button.nodeName==="BUTTON") {
            button.onclick = function (event) {
                event.preventDefault();
                tools[this.id].call(this);
            }
        }
    }
    function setImageData(data, rows, cols) {
        // Canvas store data in the form of 1 d array
        // we get the data a 3d array(row,cols,rgba)
        // Image is a 1 d array, we copy the data of 3d rgba array we get as a parameter to a 1d array
        // make a array of size of row*cols*4
        const Image = Array.from({ length: rows*cols*4 });
        for(let i = 0;i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                for (let k = 0; k < 4; k++) {
                    Image[( i*cols + j ) * 4 + k ] = data[i][j][k];
                }
            }
        }
        const idata = context.createImageData(cols, rows);
        idata.data.set(Image);
        editor.width = cols;
        editor.height = rows;
        // setting that image to the canvas
        context.putImageData(idata, 0, 0);
    }
    function getRGBArray(rows, cols) {
        // convert image to 3d array
        // pixel( 4 values )-> row -> RGBImage 
        // getImagedata takes 4 parameters (x,y,length of x, length of y);
        let data = context.getImageData(0, 0, cols, rows).data;
        const RGBImage = [];
        // rgbImage is a 3d array
        for(let i=0;i<rows;i++){
            let row = [];
            for(let j=0;j<cols;j++){
                let pixel = [];
                for(let k=0;k<4;k++){
                    pixel.push(data[(i*cols+j)*4+k]);
                }
                row.push(pixel);
            }
            RGBImage.push(row);
        }
        return RGBImage;
    }

    // tools is an map to functions of each id
    const tools = {
        "upload" : function () {
            const upload = document.createElement('input');
            upload.type = "file";
            upload.click();
            upload.onchange = function() {
                const img = new Image();
                // First we get the file then this onload is called
                img.onload = () => {
                    editor.width = img.width;
                    editor.height = img.height;
                    context.drawImage(img, 0,0);
                };
                img.onerror = () => {
                    console.error("The provided file couldn't be loaded as an Image media");
                };
                //  when the image is set on src then onload function is called
                img.src = URL.createObjectURL(this.files[0]);
            };
        },

        // To save our image
        "save" : function(){
            // taking image from the canvas
            const image = editor.toDataURL();
            const link = document.createElement('a');
            link.download = 'image.png';
            link.href = image;
            link.click();
        },

        // Flip Horizontally
        "flipHor" : function(){
            let cols = editor.width; 
            let rows = editor.height; 
            let image = getRGBArray(rows, cols);

            // swap the pixels in 2d array
            for(let i=0;i<Math.floor(rows/2);i++){
                for(let j=0;j<cols;j++){
                    let tmp = image[i][j];
                    image[i][j] = image[rows-1-i][j];
                    image[rows-1-i][j] = tmp;
                }
            }
            setImageData(image, rows, cols);
        },
        "flipVert" : function(){
            let cols = editor.width; 
            let rows = editor.height; 
            let image = getRGBArray(rows, cols);

            for(let i=0;i<rows;i++){
                for(let j=0;j<Math.floor(cols/2);j++){
                    let tmp = image[i][j];
                    image[i][j] = image[i][cols-1-j];
                    image[i][cols-1-j] = tmp;
                }
            }
            setImageData(image, rows, cols);
        },
        "rotateL" : function () {
            let cols = editor.width; 
            let rows = editor.height; 
            let image = getRGBArray(rows, cols);

            let limage = [];
            for(let i=cols-1;i>=0;i--){
                let row = [];
                for(let j=0;j<rows;j++){
                    row.push(image[j][i]);
                }
                limage.push(row);
            }
            setImageData(limage, cols, rows);
        },
        "rotateR" : function () {
            let cols = editor.width; 
            let rows = editor.height; 
            let image = getRGBArray(rows, cols);

            let rimage = [];
            for(let i=0;i<cols;i++){
                let row = [];
                for(let j=rows-1;j>=0;j--){
                    row.push(image[j][i]);
                }
                rimage.push(row);
            }
            setImageData(rimage, cols, rows);
        },
        "resize" : function(){
            let cols = editor.width; 
            let rows = editor.height; 
            let image = getRGBArray(rows, cols);

            // ask for height and width in prompt
            let inp = prompt('Current Width : '+cols + '\n' + 'Current Height : '+rows + '\n' + 'Give the new width and height in a space separated manner').split(' ');

            // give an error 
            if(inp.length!==2){
                alert('Incorrect dimensions in input');
                return;
            }
            let ncols = parseInt(inp[0]);
            let nrows = parseInt(inp[1]);
            if(isNaN(ncols) || isNaN(nrows)){
                alert('Input is not a proper number');
                return;
            }

            let hratio = rows/nrows;
            let wratio = cols/ncols;

            let nimage = [];
            for(let i=0;i<nrows;i++){
                let row = [];
                for(let j=0;j<ncols;j++){
                    row.push(image[Math.floor(i*hratio)][Math.floor(j*wratio)]);
                }
                nimage.push(row);
            }
            setImageData(nimage, nrows, ncols);
        },

        // convert color image to grey image
        // R G B A -> Shade , A
        // Shade -> 0.3*R + 0.59*G + 0.11*B
        "greyscale" : function(){
            let cols = editor.width; 
            let rows = editor.height; 
            let image = getRGBArray(rows, cols);

            for(let i=0;i<rows;i++){
                for(let j=0;j<cols;j++){
                    let pixel = image[i][j];
                    let shade = Math.floor(0.3*pixel[0]+0.59*pixel[1]+0.11*pixel[2]);
                    image[i][j][0] = image[i][j][1] = image[i][j][2] = shade;
                }
            }
            setImageData(image, rows, cols);
        }
    };

   
};