## [Video Link ▶️](https://youtu.be/jzwaZvIA998)

### Is the student able to explain clearly what steganography means?

Steganography is the practice of hiding information or a message from the human eye inside another message, a physical object or in this case, an image file. It differs from encryption in that instead of securing the message content, it tries to hide the fact that there is a message being hidden or sent in the first place. Steganography makes it difficult for unintended recipients to detect the hidden information.

### Is the student able to explain clearly how some information can be hidden in normal files?

- Image steganography:
  Method of hiding data inside an image file as cover data.
  Most commonly used methods in image steganography:
  Least Significant Bit (LSB),
  Spread spectrum,
  F5,
  Palette embedding,
  Wavelet transform,
  Data masking,

  In this exercise the information is hidden straight in the bytes of the image. When reading the file in binary and decoding bytes into utf-8 the message is revealed.

- Text steganography:
  Data is hidden in text files. Common methods include:
  Format Based Method,
  Random and Statistical Method,
  Linguistics Method.

- Audio steganography:
  This method hides data inside sound files.
  These methods include:
  Least Significant Bit (LSB),
  Parity coding,
  Phase coding,
  Spread spectrum,
  Echo hiding.

- Video steganography:
  technique of hiding any file or data inside a digital video format file.
  Almost all of the steganography techniques that can be applied to image and audio files can be used for video files.

Information can also be hidden in the metadata by modifying existing fields or adding new ones.

### Is the student able to explain clearly how his program works?

My program takes two argument, a -flag and image path. Then according to the falg it performs one of two actions.

1. --map: finds the gps location in the metadata of the image.
2. --steg: finds the PGP key hidden in the bytes of the file by iterating over each byte and decoding it to utf-8.

The result then gets printed to the console.
