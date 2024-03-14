require 'siwe'
require 'time'
require 'json'
require 'jwt'

class AuthController < ApplicationController
    protect_from_forgery with: :null_session, except: [:logout]
    before_action :authenticate_request!, only: [:user, :logout]
  
    def payload
        nonce_value = generate_nonce
        
        ordered_data = {
            domain: request.host_with_port,
            address: params[:address],
            uri: "#{request.protocol}#{request.host_with_port}",
            version: "1",
            statement: "gm, time to dm",
            issued_at: Time.now.utc.iso8601,
            nonce: nonce_value,
            chain_id: params[:chainId].to_s,
            expiration_time: (Time.now + 5.minutes).utc.iso8601,
            # not_before: Time.now.utc.iso8601,
            # request_id: "1", # Ensure it's a string if that's what the front-end expects
            # resources: []
          }
        
        session[:message] = ordered_data.to_json
        render json: { payload: ordered_data }
    end

    def login
        permitted_params = params.require(:payload).permit(:signature, payload: [:domain, :address, :uri, :version, 
            :chain_id, :nonce, :issued_at, :statement, :expiration_time, :not_before, :request_id, resources: []
            ])
        payload_params = permitted_params[:payload]
        signature = permitted_params[:signature]
        session_message_json = session[:message]
        message = Siwe::Message.from_json_string(session_message_json)

        if message.verify(signature, message.domain, message.issued_at, message.nonce)
            session[:message] = nil
            handle_successful_login(message.address)
          else
            head :bad_request
        end
    end

    def user
        if @current_user
            @current_user.seen
            render json: { user: @current_user, lastSeen: @current_user.last_seen }
        else
            render json: { user: nil, message: 'no user found' }, status: :unauthorized
        end
    end

    def logout
        token = cookies.encrypted[:auth_token]
        puts "Logging out user with token: #{token}"
        if @current_user
            user = User.find_by(eth_address: @current_user.eth_address)
            puts "Current token_version: #{user.token_version}"
            user.token_version += 1
            if user.save
                puts "Updated token_version: #{user.token_version}"
                # binding.pry
                cookies.delete(:auth_token)
                head :no_content
            else 
                render json: { message: 'could not update user token version', errors: user.errors.full_messages }, status: :unprocessable_entity
            end
        else
            render json: { message: 'no user found to log out' }, status: :unauthorized
        end
    end

    private

    def generate_nonce
        Siwe::Util.generate_nonce
    end

    def handle_successful_login(message_address) 
        user = User.find_or_create_by(eth_address: message_address.downcase)
        if user
            user.seen
            jwt_token = generate_jwt_token(user.eth_address, user.token_version)
            
            # Set an HTTP-Only cookie
            cookies.encrypted[:auth_token] = {
                value: jwt_token,
                httponly: true,
                secure: Rails.env.production?, # ensure this is true in production for HTTPS
                same_site: :strict,
                expires: 24.hours.from_now
            }
            
            render json: { status: "Login successful", ok: true, token: jwt_token }
        else
            render json: { error: "User not found or could not be created" }, status: :unprocessable_entity
        end
    end
    
    def generate_jwt_token(eth_address, token_version)
        puts "Generating JWT token for #{eth_address} with token_version #{token_version}"
        payload = {
          sub: eth_address.downcase,
          iat: Time.now.to_i,
          exp: Time.now.to_i + 24 * 3600, # 24 hours
          aud: request.host_with_port,
          token_version: token_version
        }
        JWT.encode(payload, ENV['JWT_KEY'], 'HS256')
    end

    protected

    def auth_request?
      request.path.start_with?('/auth/')
    end

end
