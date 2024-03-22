module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      token = request.cookie_jar.encrypted['auth_token']
      puts "[Connection] Raw token from cookies: #{token}"
      self.current_user = Authentication.find_verified_user_from_token(token)
      puts "[Connection] Current user found: #{self.current_user.inspect}"
      reject_unauthorized_connection unless self.current_user
    end

  end
end
