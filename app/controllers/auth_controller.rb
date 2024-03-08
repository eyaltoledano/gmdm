class AuthController < ApplicationController
    protect_from_forgery with: :null_session
    skip_forgery_protection if: :auth_request?

    require 'siwe'
    require 'time'

    def payload
        # grab the params
        nonce = generate_nonce
        # create a new message

        message = Siwe::Message.new(
            request.host_with_port,
            params[:address],
            "#{request.protocol}#{request.host_with_port}",
            "1", 
            {
                issued_at: Time.now.utc.iso8601,
                statement: "gm, get ready to dm",
                nonce: nonce,
                chain_id: params[:chainId],
            }
        )

        session[:message] = message.to_json_string

        binding.pry
    
        render json: message.prepare_message
    end

    def login
        message = Siwe::Message.from_json_string session[:message]

        if message.verify(params.require(:signature), message.domain, message.issued_at, message.nonce)
            session[:message] = nil
            session[:ens] = params[:ens]
            session[:eth_address] = message.address #eth_address or address?
      
            last_seen = DateTime.now
            User.upsert({ eth_address: message.address, last_seen: last_seen })
      
            render json: { ens: session[:ens], eth_address: session[:eth_address], lastSeen: last_seen }
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

    protected

    def auth_request?
      request.path.start_with?('/auth/')
    end

end
