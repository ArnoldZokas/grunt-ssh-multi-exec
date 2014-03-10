# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    config.vm.provision :shell, :path => "vagrant_bootstrap.sh"

    config.vm.define "one" do |one|
        one.vm.box = "Official Ubuntu 12.04 daily Cloud Image amd64 (VirtualBox 4.1.12)"
        one.vm.box_url = "http://cloud-images.ubuntu.com/vagrant/precise/current/precise-server-cloudimg-amd64-vagrant-disk1.box"
        one.vm.network :forwarded_port, guest: 22, host: 2222, id: "ssh"
    end

    config.vm.define "two" do |two|
        two.vm.box = "Official Ubuntu 12.04 daily Cloud Image amd64 (VirtualBox 4.1.12)"
        two.vm.box_url = "http://cloud-images.ubuntu.com/vagrant/precise/current/precise-server-cloudimg-amd64-vagrant-disk1.box"
        two.vm.network :forwarded_port, guest: 22, host: 2223, id: "ssh"
    end
end