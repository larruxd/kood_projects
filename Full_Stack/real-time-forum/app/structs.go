package app

type SignupInfo struct {
	Username  string `json:"username"`
	Age       string `json:"age"`
	Gender    string `json:"gender"`
	FirstName string `json:"first-name"`
	LastName  string `json:"last-name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type LoginInfo struct {
	LoginID  string `json:"LoginID"`
	Password string `json:"password"`
}

type UsernamesEmails struct {
	Users  []string
	Emails []string
}

type PostsComments struct {
	Posts    []PostResponse
	Comments []CommentsResponse
}

type LoginResponse struct {
	LoginName string
	UserID    int
	CookieKey string
}

type AuthResponse struct {
	Message   string
	LoginName string
}

type PostResponse struct {
	PostID     int
	UserID     int
	Username   string
	Title      string
	Content    string
	CategoryID int
	Category   string
	Date       string
}

type CommentsResponse struct {
	CommentID int
	PostID    int
	UserID    int
	Username  string
	Content   string
	Date      string
}

type Category struct {
	CategoryID   int
	CategoryName string
}

type NewPost struct {
	Title    string `json:"post-title"`
	Content  string `json:"post-content"`
	Category string `json:"post-category"`
}

type NewComment struct {
	Content string `json:"comment-content"`
	UserID  int    `json:"user-id"`
	PostID  int    `json:"post-id"`
}

type AllPost struct {
	Title    string
	Content  string
	Category string
	Date     string
	User     string
}
