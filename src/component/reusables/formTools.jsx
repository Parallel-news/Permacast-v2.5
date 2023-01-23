
/**
 * Reusable Text Validation Box to Appear Under Respective Input
 * @param {valMsg, className} props 
 * @returns Text highlighted validation concern
 */
export const ValMsg = props => {
    const { valMsg, className } = props;
    return  (
      <p className={`text-red-300 flex ${className}`}>{valMsg}</p>
    );
}

/**
 * Verifies whether email meets certain patterns
 * @param {string} email 
 * @returns boolean value of whether email matches pattern of '@' and '.' presence
 */
export const isValidEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


export function reduceImageSize(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function() {
      var image = new Image();
      image.src = reader.result;

      image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        var MAX_SIZE = 64 * 1024;
        var quality = 1;
        while (true) {
            canvas.toBlob(function(blob) {
                var fileSize = blob.size;
                if (fileSize <= MAX_SIZE) {
                    resolve(blob);
                }
                quality -= 0.1;
            }, 'image/jpeg', quality);
        }
      };
    };
  });
}