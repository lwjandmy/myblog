#!/usr/bin/env expect

set timeout -1

set GITPASSWORD [lindex $argv 0]

spawn git push origin_oschina gh-pages origin_oschina/gh-pages

expect {
  "Username" {
    send "$env(GITUSERNAME)\r"
    expect {
      "Password" {
        send "$GITPASSWORD\r"
        expect {
          eof
        }
      }
    }
  }
}

spawn git push origin_github gh-pages origin_github/gh-pages

expect {
  "Username" {
    send "$env(GITUSERNAME)\r"
    expect {
      "Password" {
        send "$GITPASSWORD\r"
        expect {
          eof
        }
      }
    }
  }
}
