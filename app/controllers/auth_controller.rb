class AuthController < ApplicationController
    protect_from_forgery with: :null_session

    require 'siwe'
    require 'time'
    require 'json'

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
            binding.pry
            puts "Signature is valid"
            session[:message] = nil
            session[:ens] = params[:ens] if params[:ens]
            session[:eth_address] = message.address
      
            handle_successful_login(message.address)
          else
            head :bad_request
        end
    end

    def user
        # binding.pry
        if current_user
            current_user.seen
            current_user.save
            render json: { user: current_user, ens: session[:ens], eth_address: session[:eth_address], lastSeen: current_user.last_seen }
        else
            # return object with no user
            render json: { user: nil, ens: session[:ens], eth_address: session[:eth_address] }
        end
    end

    def logout
        if current_user
            current_user.seen
            current_user.save
            session[:ens] = nil
            session[:eth_address] = nil
            head :no_content
        else
            head :unauthorized
        end
    end

    private

    def generate_nonce
        Siwe::Util.generate_nonce
    end

    def handle_successful_login(message_address)
        last_seen = DateTime.now
        # Upsert user based on Ethereum address, handling new user creation or updating last_seen
        User.upsert({ eth_address: message_address, last_seen: last_seen }, unique_by: :eth_address)
        render json: { status: "Login successful" }
    end

    protected

    def auth_request?
      request.path.start_with?('/auth/')
    end

end
