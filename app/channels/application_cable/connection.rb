module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      token = request.cookies['auth_token']
      puts "[connection.rb] token before being decoded: #{token}"
      decoded_token = URI.decode_www_form_component(token)
      puts "[connection.rb] token after being decoded being sent to authentication.rb: #{decoded_token}"
      # binding.pry
      self.current_user = Authentication.find_verified_user_from_token(decoded_token)
      reject_unauthorized_connection unless self.current_user
    end

  end
end
