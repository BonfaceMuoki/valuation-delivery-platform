<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendTenantEmail extends Mailable
    {
    use Queueable, SerializesModels;

    public $token, $callbackurl, $message, $mailtype, $property, $logincallback;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($token, $callbackurl, $logincallback, $mailtype, $message, $property)
        {
        $this->token = $token;
        $this->callbackurl = $callbackurl;
        $this->mailtype = $mailtype;
        $this->message = $message;
        $this->property = $property;
        $this->logincallback = $logincallback;
        }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
        {
        if ($this->mailtype == "invite") {
            return $this->markdown('Email.tenant.inviteemail')->with([
                'token' => $this->token,
                'callbackurl' => $this->callbackurl,
                'logincallback' => $this->logincallback,
                'property' => $this->property

            ]);
            } else {

            }

        }
    }