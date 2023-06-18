<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendCompanyRegistrationRequestDeclineMail extends Mailable
{
    use Queueable, SerializesModels;
    protected $invitedetails,$message;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($message,$invitedetails)
    {
        $this->message=$message;
        $this->invitedetails=$invitedetails;
        //
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Registration Decline',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'Email.registrationrequestdenial',
            with:[
                'reason'=>$this->message,
                'invitedetails'=>$this->invitedetails
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
